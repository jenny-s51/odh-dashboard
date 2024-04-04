import { DEFAULT_TASK_NODE_TYPE } from '@patternfly/react-topology';
import { genRandomChars } from '~/utilities/string';
import { NODE_HEIGHT, NODE_WIDTH } from './const';
import { NodeConstructDetails, PipelineNodeModelExpanded } from './types';

export const createNodeId = (prefix = 'node'): string => `${prefix}-${genRandomChars()}`;

export const ICON_TASK_NODE_TYPE = 'ICON_TASK_NODE';

export const NODE_PADDING_VERTICAL = 0;
export const NODE_PADDING_HORIZONTAL = 15;

export const ARTIFACT_NODE_WIDTH = 54;
export const ARTIFACT_NODE_HEIGHT = 44;

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
  data: details.status
    ? {
        status: details.status,
        artifactType: details.artifactType,
      }
    : undefined,
});

export const createGroupNode = (details: NodeConstructDetails): PipelineNodeModelExpanded => ({
  id: details.id,
  label: details.id,
  type: 'Execution',
  group: true,
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
  runAfterTasks: details.runAfter,
  style: {
    padding: [NODE_PADDING_VERTICAL, NODE_PADDING_HORIZONTAL],
  },
  children: details.tasks ?? undefined,
  data: details.status
    ? {
        status: details.status,
        artifactType: details.artifactType,
      }
    : undefined,
});
