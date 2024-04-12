import { DEFAULT_TASK_NODE_TYPE } from '@patternfly/react-topology';
import { genRandomChars } from '~/utilities/string';
import { NODE_HEIGHT, NODE_WIDTH } from './const';
import { NodeConstructDetails, PipelineNodeModelExpanded } from './types';
import {
  NotStartedIcon,
  SyncAltIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  BanIcon,
} from '@patternfly/react-icons';
import { RuntimeStateKF, runtimeStateLabels } from '../pipelines/kfTypes';
import React from 'react';

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

export const getNodeStatusIcon = (status) => {
  let icon: React.ReactNode;
  let details: string | undefined;

  switch (status) {
    case RuntimeStateKF.PENDING:
    case RuntimeStateKF.RUNTIME_STATE_UNSPECIFIED:
    case undefined:
      icon = <NotStartedIcon />;
      break;
    case RuntimeStateKF.RUNNING:
      icon = <SyncAltIcon />;
      break;
    case RuntimeStateKF.SKIPPED:
      icon = <CheckCircleIcon />;
      break;
    case 'Succeeded':
      icon = <CheckCircleIcon />;
      status = 'success';
      break;
    case RuntimeStateKF.FAILED:
      icon = <ExclamationCircleIcon />;
      status = 'danger';
      break;
    case RuntimeStateKF.CANCELING:
      icon = <BanIcon />;
      break;
    case RuntimeStateKF.CANCELED:
      icon = <BanIcon />;
      break;
    case RuntimeStateKF.PAUSED:
      icon = <BanIcon />;
    default:
      icon = null;
  }

  return { icon, status, details };
};
