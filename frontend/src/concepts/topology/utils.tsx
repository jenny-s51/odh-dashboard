import { DEFAULT_TASK_NODE_TYPE } from '@patternfly/react-topology';
import {
  NotStartedIcon,
  SyncAltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  BanIcon,
} from '@patternfly/react-icons';
import React from 'react';
import { Icon } from '@patternfly/react-core';
import { genRandomChars } from '~/utilities/string';
import { RuntimeStateKF, runtimeStateLabels } from '~/concepts/pipelines/kfTypes';
import { RunStatusDetails } from '~/concepts/pipelines/content/utils';
import { NODE_HEIGHT, NODE_WIDTH } from './const';
import { NodeConstructDetails, PipelineNodeModelExpanded } from './types';

export const createNodeId = (prefix = 'node'): string => `${prefix}-${genRandomChars()}`;

export const ICON_TASK_NODE_TYPE = 'ICON_TASK_NODE';

export const ARTIFACT_NODE_WIDTH = 44;
export const ARTIFACT_NODE_HEIGHT = NODE_HEIGHT;

export const NODE_PADDING_VERTICAL = 40;
export const NODE_PADDING_HORIZONTAL = 15;

export const createNode = (details: NodeConstructDetails): PipelineNodeModelExpanded => ({
  id: details.id,
  label: details.label,
  type: DEFAULT_TASK_NODE_TYPE,
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
  runAfterTasks: details.runAfter,
  data: details.status
    ? {
        status: details.status,
      }
    : undefined,
});

export const createArtifactNode = (details: NodeConstructDetails): PipelineNodeModelExpanded => ({
  id: details.id,
  label: `${details.label} (Type: ${details.artifactType?.slice(7)})`,
  type: ICON_TASK_NODE_TYPE,
  width: ARTIFACT_NODE_WIDTH,
  height: ARTIFACT_NODE_HEIGHT,
  runAfterTasks: details.runAfter,
  data: { status: details.status ?? undefined, artifactType: details.artifactType },
});

export const createGroupNode = (
  details: NodeConstructDetails,
  children: string[],
): PipelineNodeModelExpanded => ({
  id: details.id,
  label: details.id,
  type: 'Execution',
  group: true,
  collapsed: true,
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
  runAfterTasks: details.runAfter,
  style: {
    padding: [NODE_PADDING_VERTICAL + 24, NODE_PADDING_HORIZONTAL],
  },
  children,
  data: details.status
    ? {
        status: details.status,
        artifactType: details.artifactType,
      }
    : undefined,
});

export const getNodeStatusIcon = (runStatus: RuntimeStateKF | string): RunStatusDetails => {
  let icon: React.ReactNode;
  let status: React.ComponentProps<typeof Icon>['status'];
  let label: string;

  switch (runStatus) {
    case RuntimeStateKF.PENDING:
    case RuntimeStateKF.RUNTIME_STATE_UNSPECIFIED:
    case undefined:
      icon = <NotStartedIcon />;
      label = runtimeStateLabels[RuntimeStateKF.PENDING];
      break;
    case RuntimeStateKF.RUNNING:
      icon = <SyncAltIcon />;
      label = runtimeStateLabels[RuntimeStateKF.RUNNING];
      break;
    case RuntimeStateKF.SKIPPED:
      icon = <CheckCircleIcon />;
      label = runtimeStateLabels[RuntimeStateKF.SKIPPED];
      break;
    case RuntimeStateKF.SUCCEEDED:
      icon = <CheckCircleIcon />;
      status = 'success';
      label = runtimeStateLabels[RuntimeStateKF.SUCCEEDED];
      break;
    case RuntimeStateKF.FAILED:
      icon = <ExclamationCircleIcon />;
      status = 'danger';
      label = runtimeStateLabels[RuntimeStateKF.FAILED];
      break;
    case RuntimeStateKF.CANCELING:
      icon = <BanIcon />;
      label = runtimeStateLabels[RuntimeStateKF.CANCELING];
      break;
    case RuntimeStateKF.CANCELED:
      icon = <BanIcon />;
      label = runtimeStateLabels[RuntimeStateKF.CANCELED];
      break;
    case RuntimeStateKF.PAUSED:
      icon = <BanIcon />;
      label = runtimeStateLabels[RuntimeStateKF.PAUSED];
      break;
    default:
      icon = null;
      label = '';
  }

  return { label, icon, status };
};
