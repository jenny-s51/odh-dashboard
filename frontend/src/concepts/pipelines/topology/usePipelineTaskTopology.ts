import { PipelineRunKFv2, PipelineSpecVariable, TaskKF } from '~/concepts/pipelines/kfTypes';
import { createNode } from '~/concepts/topology';
import { NodeConstructDetails, PipelineNodeModelExpanded } from '~/concepts/topology/types';
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

export const usePipelineTaskTopology = (
  spec?: PipelineSpecVariable,
  run?: PipelineRunKFv2,
): KubeFlowTaskTopology => {
  if (!spec) {
    return { taskMap: {}, nodes: [] };
  }
  const pipelineSpec = spec.pipeline_spec ?? spec;

  const {
    components,
    deploymentSpec: { executors },
    root: {
      dag: { tasks: rootTasks },
    },
  } = pipelineSpec;
  const { run_details: runDetails } = run || {};

  const componentArtifactMap = parseComponentsForArtifactRelationship(components);
  const nodes: PipelineNodeModelExpanded[] = [];
  const taskMap: KubeFlowTaskTopology['taskMap'] = {};

  const createNodes = (tasks: Record<string, TaskKF>, parentTask?: string) => {
    const taskArtifactMap = parseTasksForArtifactRelationship(tasks);
    Object.entries(tasks).forEach(([taskId, taskValue]) => {
      const taskName = taskValue.taskInfo.name;

      const componentRef = taskValue.componentRef.name;
      const component = components[componentRef];
      const artifactsInComponent = componentArtifactMap[componentRef];
      const isGroupNode = !!component?.dag;

      const executorLabel = component?.executorLabel;
      const executor = executorLabel ? executors[executorLabel] : undefined;

      const status = parseRuntimeInfo(taskId, runDetails);

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

          taskMap[id] = {
            type: 'artifact',
            name: label,
            inputs: {
              artifacts: [{ label: id, type: composeArtifactType(data) }],
            },
          };
        });
      }

      // This task
      taskMap[taskId] = {
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
      } else if (parentTask) {
        // Create an edge from the grouped task to its parent task
        // Prevent the node floating on the topology
        // This logic could be removed once we have the stacked node to better deal with groups
        runAfter.push(parentTask);
      }

      nodes.push(
        createGroupNode({
          id: taskId,
          label: taskName,
          runAfter,
          tasks: tasks.map((i) => i.id),
          status: translateStatusForNode(status?.state),
        }),
      );
      // This task's rendering information
      if (isGroupNode) {
        // TODO: better handle group nodes
        createNodes(component.dag.tasks, taskId);
      }
    });
  };
  createNodes(rootTasks);
  return { nodes, taskMap };
};
