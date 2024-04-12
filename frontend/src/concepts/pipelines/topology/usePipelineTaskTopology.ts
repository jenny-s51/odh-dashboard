import {
  PipelineComponentsKF,
  PipelineRunKFv2,
  PipelineSpecVariable,
  RunDetailsKF,
  TaskKF,
} from '~/concepts/pipelines/kfTypes';
import { createNode } from '~/concepts/topology';
import { PipelineNodeModelExpanded } from '~/concepts/topology/types';
import { createArtifactNode, createGroupNode } from '~/concepts/topology/utils';
import {
  composeArtifactType,
  parseComponentsForArtifactRelationship,
  parseInputOutput,
  parseRuntimeInfo,
  parseTasksForArtifactRelationship,
  parseVolumeMounts,
  translateStatusForNode,
} from './parseUtils';
import { KubeFlowTaskTopology } from './pipelineTaskTypes';

const EMPTY_STATE: KubeFlowTaskTopology = { taskMap: {}, nodes: [] };

const getNestedNodes = (
  items: Record<string, TaskKF>,
  components: PipelineComponentsKF,
  runDetails?: RunDetailsKF,
): [nestedNodes: PipelineNodeModelExpanded[], children: string[]] => {
  const nodes: PipelineNodeModelExpanded[] = [];
  const children: string[] = [];

  Object.entries(items).forEach(([name, details]) => {
    const componentRef = details.componentRef.name;
    const status = parseRuntimeInfo(name, runDetails);
    const runAfter: string[] = details.dependentTasks ?? [];
    const hasSubTask =
      Object.keys(components).find((task) => task === componentRef) &&
      components[componentRef]?.dag;
    const subTasks = components[componentRef]?.dag?.tasks;

    if (hasSubTask && subTasks) {
      const [nestedNodes, nestedChildren] = getNestedNodes(subTasks, components);
      const itemNode = createGroupNode(
        {
          id: name,
          label: name,
          runAfter,
          status: translateStatusForNode(status?.state),
        },
        nestedChildren,
      );
      nodes.push(itemNode, ...nestedNodes);
    } else {
      nodes.push(
        createNode({
          id: name,
          label: name,
          runAfter,
          status: translateStatusForNode(status?.state),
        }),
      );
    }
    children.push(name);
  });

  return [nodes, children];
};

export const usePipelineTaskTopology = (
  spec?: PipelineSpecVariable,
  run?: PipelineRunKFv2,
): KubeFlowTaskTopology => {
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
  const { run_details: runDetails } = run || {};

  const componentArtifactMap = parseComponentsForArtifactRelationship(components);
  const taskArtifactMap = parseTasksForArtifactRelationship(tasks);

  return Object.entries(tasks).reduce<KubeFlowTaskTopology>((acc, [taskId, taskValue]) => {
    const taskName = taskValue.taskInfo.name;

    const componentRef = taskValue.componentRef.name;
    const component = components[componentRef];
    const artifactsInComponent = componentArtifactMap[componentRef];
    const isGroupNode = !!component?.dag;
    const groupTasks = component?.dag?.tasks;

    const executorLabel = component?.executorLabel;
    const executor = executorLabel ? executors[executorLabel] : undefined;

    const status = parseRuntimeInfo(taskId, runDetails);

    const newTaskMapEntries: KubeFlowTaskTopology['taskMap'] = {};
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

        nodes.push(
          createArtifactNode({
            id,
            label,
            artifactType: data.schemaTitle,
            runAfter: [taskId],
            status: translateStatusForNode(status?.state),
          }),
        );

        newTaskMapEntries[id] = {
          type: 'artifact',
          name: label,
          inputs: {
            artifacts: [{ label: id, type: composeArtifactType(data) }],
          },
        };
      });
    }

    // This task
    newTaskMapEntries[taskId] = {
      type: isGroupNode ? 'groupTask' : 'task',
      name: taskName,
      steps: executor ? [executor.container] : undefined,
      inputs: parseInputOutput(component?.inputDefinitions),
      outputs: parseInputOutput(component?.outputDefinitions),
      status,
      volumeMounts: parseVolumeMounts(spec.platform_spec, executorLabel),
    };
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


    // This task's rendering information
    if (isGroupNode && groupTasks) {
      const [nestedNodes, children] = getNestedNodes(groupTasks, components, runDetails);
      const itemNode = createGroupNode(
        {
          id: taskId,
          label: taskName,
          runAfter,
          status: translateStatusForNode(status?.state),
        },
        children,
      );
      nodes.push(itemNode, ...nestedNodes);

      // Extract IDs and create new entries
      nestedNodes.forEach((node) => {
        const { id } = node;
        newTaskMapEntries[id] = {
          type: 'groupTask',
          name: id,
          steps: executor ? [executor.container] : undefined,
          inputs: parseInputOutput(component?.inputDefinitions),
          outputs: parseInputOutput(component?.outputDefinitions),
          status,
          volumeMounts: parseVolumeMounts(spec.platform_spec, executorLabel),
        };
      });
    } else {
      nodes.push(
        createNode({
          id: taskId,
          label: taskName,
          runAfter,
          status: translateStatusForNode(status?.state),
        }),
      );
    }

    return {
      taskMap: {
        ...acc.taskMap,
        ...newTaskMapEntries,
      },
      nodes: [...acc.nodes, ...nodes],
    };
  }, EMPTY_STATE);
};
