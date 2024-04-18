import { RunStatus } from '@patternfly/react-topology';
import {
  ArtifactStateKF,
  DAG,
  ExecutionStateKF,
  InputOutputArtifactType,
  InputOutputDefinition,
  PipelineComponentsKF,
  PlatformSpec,
  RunDetailsKF,
  RuntimeStateKF,
  TaskDetailKF,
  TaskKF,
} from '~/concepts/pipelines/kfTypes';
import { VolumeMount } from '~/types';
import { Artifact, Execution } from '~/third_party/mlmd';
import { PipelineTaskInputOutput, PipelineTaskRunStatus } from './pipelineTaskTypes';

export const composeArtifactType = (data: InputOutputArtifactType): string =>
  `${data.schemaTitle} (${data.schemaVersion})`;

export type ComponentArtifactMap = {
  [componentName: string]: { [artifactId: string]: InputOutputArtifactType } | undefined;
};
export const parseComponentsForArtifactRelationship = (
  components: PipelineComponentsKF,
): ComponentArtifactMap =>
  Object.entries(components).reduce<ComponentArtifactMap>(
    (map, [componentId, componentValue]) =>
      Object.entries(componentValue?.outputDefinitions?.artifacts ?? {}).reduce(
        (artifactItems, [artifactId, value]) => {
          const { artifactType } = value;

          return {
            ...artifactItems,
            [componentId]: {
              ...artifactItems[componentId],
              [artifactId]: artifactType,
            },
          };
        },
        map,
      ),
    {},
  );

export type TaskArtifactMap = {
  [taskName: string]: { outputArtifactKey: string; artifactId: string }[] | undefined;
};
export const parseTasksForArtifactRelationship = (tasks: DAG['tasks']): TaskArtifactMap =>
  Object.values(tasks).reduce<TaskArtifactMap>(
    (map, taskValue) =>
      Object.entries(taskValue.inputs?.artifacts ?? {}).reduce(
        (artifactItems, [artifactId, value]) => {
          const { producerTask: taskId, outputArtifactKey } = value.taskOutputArtifact || {};
          if (!taskId || !outputArtifactKey) {
            // eslint-disable-next-line no-console
            console.warn('Issue constructing artifact node', value);
            return artifactItems;
          }

          return {
            ...artifactItems,
            [taskId]: [
              ...(artifactItems[taskId] ?? []),
              {
                outputArtifactKey,
                artifactId,
              },
            ],
          };
        },
        map,
      ),
    {},
  );

export const parseInputOutput = (
  definition?: InputOutputDefinition,
): PipelineTaskInputOutput | undefined => {
  let data: PipelineTaskInputOutput | undefined;
  if (definition) {
    const { artifacts, parameters } = definition;
    data = {};

    if (parameters) {
      data = {
        ...data,
        params: Object.entries(parameters).map(([paramLabel, { parameterType }]) => ({
          label: paramLabel,
          type: parameterType,
          // TODO: support value
        })),
      };
    }

    if (artifacts) {
      data = {
        ...data,
        artifacts: Object.entries(artifacts).map(([paramLabel, { artifactType }]) => ({
          label: paramLabel,
          type: composeArtifactType(artifactType),
          // TODO: support value
        })),
      };
    }
  }

  return data;
};

export const parseSubTaskInputOutput = (definition: TaskKF['inputs']) => {
  let data;
  if (definition) {
    const { artifacts, parameters } = definition;
    data = {};

    if (parameters) {
      data = {
        ...data,
        params: Object.entries(parameters).map(
          ([paramLabel, { componentInputParameter }]) => ({
            label: paramLabel,
            type: typeof(componentInputParameter),
            // TODO: support value
          }),
        ),
      };
    }

    if (artifacts) {
      data = {
        ...data,
        artifacts: Object.entries(artifacts).map(([paramLabel, { taskOutputArtifact }]) => ({
          label: paramLabel,
          type: typeof(taskOutputArtifact?.producerTask),
          // TODO: support value
        })),
      };
    }
  }

  return data;
};

export const lowestProgress = (details: TaskDetailKF[]): PipelineTaskRunStatus['state'] => {
  const statusWeight = (status?: RuntimeStateKF) => {
    switch (status) {
      case RuntimeStateKF.PENDING:
        return 10;
      case RuntimeStateKF.RUNNING:
        return 20;
      case RuntimeStateKF.SKIPPED:
        return 30;
      case RuntimeStateKF.PAUSED:
        return 40;
      case RuntimeStateKF.CANCELING:
        return 59;
      case RuntimeStateKF.CANCELED:
        return 51;
      case RuntimeStateKF.SUCCEEDED:
        return 60;
      case RuntimeStateKF.FAILED:
        return 70;
      case RuntimeStateKF.RUNTIME_STATE_UNSPECIFIED:
      default:
        return 0;
    }
  };

  return details.sort(
    ({ state: stateA }, { state: stateB }) => statusWeight(stateB) - statusWeight(stateA),
  )[0].state;
};

export const parseRuntimeInfoFromRunDetails = (
  taskId: string,
  runDetails?: RunDetailsKF,
): PipelineTaskRunStatus | undefined => {
  if (!runDetails) {
    return undefined;
  }
  const { task_details: taskDetails } = runDetails;

  // taskId should always be first, as it's the most direct item, but it may not drive the entire details
  const nameVariants = [taskId, `${taskId}-driver`];
  const thisTaskDetail = taskDetails.filter(({ display_name: name, execution_id: executionId }) =>
    nameVariants.includes(name ?? executionId ?? ''),
  );
  if (thisTaskDetail.length === 0) {
    // No details yet
    return undefined;
  }

  return {
    startTime: thisTaskDetail[0].start_time,
    completeTime: thisTaskDetail[0].end_time,
    state: lowestProgress(thisTaskDetail),
    taskId: `task.${taskId}`,
    podName: thisTaskDetail[0].child_tasks?.find((o) => o.pod_name)?.pod_name,
  };
};

export const parseRuntimeInfoFromExecutions = (
  taskId: string,
  executions?: Execution[] | null,
): PipelineTaskRunStatus | undefined => {
  if (!executions) {
    return undefined;
  }

  const execution = executions.find(
    (e) => e.getCustomPropertiesMap().get('task_name')?.getStringValue() === taskId,
  );

  if (!execution) {
    return undefined;
  }

  const lastUpdatedTime = execution.getLastUpdateTimeSinceEpoch();
  let completeTime;
  const lastKnownState = execution.getLastKnownState();
  // Logic comes from https://github.com/opendatahub-io/data-science-pipelines/blob/master/frontend/src/components/tabs/RuntimeNodeDetailsV2.tsx#L245-L253
  if (
    lastUpdatedTime &&
    (lastKnownState === Execution.State.COMPLETE ||
      lastKnownState === Execution.State.FAILED ||
      lastKnownState === Execution.State.CACHED ||
      lastKnownState === Execution.State.CANCELED)
  ) {
    completeTime = new Date(lastUpdatedTime).toISOString();
  }
  return {
    startTime: new Date(execution.getCreateTimeSinceEpoch()).toISOString(),
    completeTime,
    state: getResourceStateText({
      resourceType: ResourceType.EXECUTION,
      resource: execution,
    }),
    taskId: `task.${taskId}`,
    podName: execution.getCustomPropertiesMap().get('pod_name')?.getStringValue(),
  };
};

export enum ResourceType {
  ARTIFACT = 'ARTIFACT',
  EXECUTION = 'EXECUTION',
}

export interface ArtifactProps {
  resourceType: ResourceType.ARTIFACT;
  resource: Artifact;
}

export interface ExecutionProps {
  resourceType: ResourceType.EXECUTION;
  resource: Execution;
}

export type ResourceInfoProps = ArtifactProps | ExecutionProps;

// Get text representation of resource state.
// Works for both artifact and execution.
export const getResourceStateText = (
  props: ResourceInfoProps,
): ArtifactStateKF | ExecutionStateKF | undefined => {
  if (props.resourceType === ResourceType.ARTIFACT) {
    const state = props.resource.getState();
    switch (state) {
      case Artifact.State.PENDING:
        return ArtifactStateKF.PENDING;
      case Artifact.State.LIVE:
        return ArtifactStateKF.LIVE;
      case Artifact.State.MARKED_FOR_DELETION:
        return ArtifactStateKF.MARKED_FOR_DELETION;
      case Artifact.State.DELETED:
        return ArtifactStateKF.DELETED;
      default:
        return undefined;
    }
  } else {
    // type == EXECUTION
    const state = props.resource.getLastKnownState();
    switch (state) {
      case Execution.State.NEW:
        return ExecutionStateKF.NEW;
      case Execution.State.RUNNING:
        return ExecutionStateKF.RUNNING;
      case Execution.State.COMPLETE:
        return ExecutionStateKF.COMPLETE;
      case Execution.State.CANCELED:
        return ExecutionStateKF.CANCELED;
      case Execution.State.FAILED:
        return ExecutionStateKF.FAILED;
      case Execution.State.CACHED:
        return ExecutionStateKF.CACHED;
      default:
        return undefined;
    }
  }
};

export const translateStatusForNode = (
  state?: RuntimeStateKF | ExecutionStateKF | ArtifactStateKF,
): RunStatus | undefined => {
  switch (state) {
    case ExecutionStateKF.CANCELED:
    case RuntimeStateKF.CANCELED:
    case RuntimeStateKF.CANCELING:
      return RunStatus.Cancelled;
    case ExecutionStateKF.RUNNING:
      return RunStatus.Running;
    case ExecutionStateKF.FAILED:
    case RuntimeStateKF.FAILED:
      return RunStatus.Failed;
    case ArtifactStateKF.PENDING:
    case RuntimeStateKF.PAUSED:
    case RuntimeStateKF.PENDING:
      return RunStatus.Pending;
    case RuntimeStateKF.RUNNING:
      return RunStatus.InProgress;
    case ExecutionStateKF.COMPLETE:
    case RuntimeStateKF.SUCCEEDED:
      return RunStatus.Succeeded;
    case ExecutionStateKF.CACHED:
    case RuntimeStateKF.SKIPPED:
      return RunStatus.Skipped;
    case RuntimeStateKF.RUNTIME_STATE_UNSPECIFIED:
    default:
      return undefined;
  }
};

export const parseVolumeMounts = (
  platformSpec?: PlatformSpec,
  executorLabel?: string,
): VolumeMount[] => {
  if (!platformSpec || !platformSpec.platforms.kubernetes || !executorLabel) {
    return [];
  }

  const executor = platformSpec.platforms.kubernetes.deploymentSpec.executors[executorLabel];

  if (!executor || !executor.pvcMount) {
    return [];
  }
  return executor.pvcMount.map((pvc) => ({
    mountPath: pvc.mountPath,
    name: pvc.taskOutputParameter?.producerTask ?? '',
  }));
};
