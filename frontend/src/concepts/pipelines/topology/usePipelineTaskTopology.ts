import {
  PipelineComponentsKF,
  PipelineExecutorsKF,
  PipelineSpecVariable,
  RunDetailsKF,
  TaskKF,
} from '~/concepts/pipelines/kfTypes';
import { createNode } from '~/concepts/topology';
import { PipelineNodeModelExpanded } from '~/concepts/topology/types';
import { createArtifactNode, createGroupNode } from '~/concepts/topology/utils';
import { Execution } from '~/third_party/mlmd';
import {
  composeArtifactType,
  parseComponentsForArtifactRelationship,
  parseInputOutput,
  parseRuntimeInfoFromExecutions,
  parseRuntimeInfoFromRunDetails,
  parseTasksForArtifactRelationship,
  parseVolumeMounts,
  translateStatusForNode,
} from './parseUtils';
import { PipelineTask } from './pipelineTaskTypes';

const EMPTY_STATE: PipelineNodeModelExpanded[] = [];

const getNestedNodes = (
  spec: PipelineSpecVariable,
  items: Record<string, TaskKF>,
  components: PipelineComponentsKF,
  executors: PipelineExecutorsKF,
  runDetails?: RunDetailsKF,
  executions?: Execution[] | null,
): [nestedNodes: PipelineNodeModelExpanded[], children: string[]] => {
  const nodes: PipelineNodeModelExpanded[] = [];
  const children: string[] = [];

  Object.entries(items).forEach(([name, details]) => {
    const componentRef = details.componentRef.name;
    const component = components[componentRef];

    const status = executions
      ? parseRuntimeInfoFromExecutions(name, executions)
      : parseRuntimeInfoFromRunDetails(name, runDetails);

    const runAfter: string[] = details.dependentTasks ?? [];
    const hasSubTask =
      Object.keys(components).find((task) => task === componentRef) &&
      components[componentRef]?.dag;
    const subTasks = components[componentRef]?.dag?.tasks;
    const executorLabel = component?.executorLabel;
    const executor = executorLabel ? executors[executorLabel] : undefined;

    const pipelineTask: PipelineTask = {
      type: 'groupTask',
      name,
      steps: executor ? [executor.container] : undefined,
      inputs: parseInputOutput(component?.inputDefinitions),
      outputs: parseInputOutput(component?.outputDefinitions),
      status,
      volumeMounts: parseVolumeMounts(spec.platform_spec, executorLabel),
    };

    if (hasSubTask && subTasks) {
      const [nestedNodes, nestedChildren] = getNestedNodes(
        spec,
        subTasks,
        components,
        executors,
        runDetails,
        executions,
      );

      const itemNode = createGroupNode(
        name,
        name,
        pipelineTask,
        runAfter,
        translateStatusForNode(status?.state),
        nestedChildren,
      );
      nodes.push(itemNode, ...nestedNodes);
    } else {
      nodes.push(
        createNode(name, name, pipelineTask, runAfter, translateStatusForNode(status?.state)),
      );
    }
    children.push(name);
  });

  return [nodes, children];
};

export const usePipelineTaskTopology = (
  spec?: PipelineSpecVariable,
  runDetails?: RunDetailsKF,
  executions?: Execution[] | null,
): PipelineNodeModelExpanded[] => {
  if (!spec) {
    return EMPTY_STATE;
  }
  const pipelineSpec = spec.pipeline_spec ?? spec;

  const {
    components,
    deploymentSpec: { executors },
    root: {
      dag: { tasks },
    },
  } = pipelineSpec;

  const componentArtifactMap = parseComponentsForArtifactRelationship(components);
  const taskArtifactMap = parseTasksForArtifactRelationship(tasks);

  return Object.entries(tasks).reduce<PipelineNodeModelExpanded[]>((acc, [taskId, taskValue]) => {
    const taskName = taskValue.taskInfo.name;

    const componentRef = taskValue.componentRef.name;
    const component = components[componentRef];
    const artifactsInComponent = componentArtifactMap[componentRef];
    const isGroupNode = !!component?.dag;
    const groupTasks = component?.dag?.tasks;

    const executorLabel = component?.executorLabel;
    const executor = executorLabel ? executors[executorLabel] : undefined;

    const status = executions
      ? parseRuntimeInfoFromExecutions(taskId, executions)
      : parseRuntimeInfoFromRunDetails(taskId, runDetails);

    const nodes: PipelineNodeModelExpanded[] = [];
    const runAfter: string[] = taskValue.dependentTasks ?? [];

    if (artifactsInComponent) {
      const artifactNodeData = taskArtifactMap[taskId];

      Object.entries(artifactsInComponent).forEach(([artifactKey, data]) => {
        const label = artifactKey;
        const { artifactId } =
          artifactNodeData?.find((a) => artifactKey === a.outputArtifactKey) ?? {};

        // if no node needs it as an input, we don't really need a well known id
        const id = artifactId ?? artifactKey;

        const pipelineTask: PipelineTask = {
          type: 'artifact',
          name: label,
          inputs: {
            artifacts: [{ label: id, type: composeArtifactType(data) }],
          },
        };

        nodes.push(
          createArtifactNode(
            id,
            label,
            pipelineTask,
            [taskId],
            translateStatusForNode(status?.state),
            data.schemaTitle,
          ),
        );
      });
    }

    if (taskValue.dependentTasks) {
      // This task's runAfters may need artifact relationships -- find those artifactIds
      runAfter.push(
        ...taskValue.dependentTasks
          .map((dependantTaskId) => {
            const art = taskArtifactMap[dependantTaskId];
            return art ? art.map((v) => v.artifactId) : null;
          })
          .filter((v): v is string[] => !!v)
          .flat(),
      );
    }

    const pipelineTask: PipelineTask = {
      type: isGroupNode ? 'groupTask' : 'task',
      name: taskName,
      steps: executor ? [executor.container] : undefined,
      inputs: parseInputOutput(component?.inputDefinitions),
      outputs: parseInputOutput(component?.outputDefinitions),
      status,
      volumeMounts: parseVolumeMounts(spec.platform_spec, executorLabel),
    };

    // This task's rendering information
    if (isGroupNode && groupTasks) {
      const [nestedNodes, children] = getNestedNodes(
        spec,
        groupTasks,
        components,
        executors,
        runDetails,
        executions,
      );
      const itemNode = createGroupNode(
        taskId,
        taskName,
        pipelineTask,
        runAfter,
        translateStatusForNode(status?.state),
        children,
      );
      nodes.push(itemNode, ...nestedNodes);
    } else {
      nodes.push(
        createNode(taskId, taskName, pipelineTask, runAfter, translateStatusForNode(status?.state)),
      );
    }

    return [...acc, ...nodes];
  }, []);
};
