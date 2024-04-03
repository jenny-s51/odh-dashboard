import {
  ComponentFactory,
  DEFAULT_EDGE_TYPE,
  DEFAULT_SPACER_NODE_TYPE,
  DEFAULT_TASK_NODE_TYPE,
  GraphComponent,
  ModelKind,
  SpacerNode,
  withPanZoom,
  withSelection,
  TaskEdge as PFTaskEdge,
} from '@patternfly/react-topology';
import StandardTaskNode from '~/concepts/topology/customNodes/StandardTaskNode';
import { ICON_TASK_NODE_TYPE } from './utils';
import ArtifactTaskNode from './customNodes/ArtifactTaskNode';
import PipelineTaskGroup from './PipelineTaskGroup';
import PipelineTaskEdge from './PipelineTaskEdge';

export const pipelineComponentFactory: ComponentFactory = (kind, type) => {
  if (kind === ModelKind.graph) {
    return withPanZoom()(GraphComponent);
  }
  switch (type) {
    case DEFAULT_TASK_NODE_TYPE:
      return withSelection()(StandardTaskNode);
    case ICON_TASK_NODE_TYPE:
      return withSelection()(ArtifactTaskNode);
    case DEFAULT_SPACER_NODE_TYPE:
      return SpacerNode;
    case DEFAULT_EDGE_TYPE:
      return PipelineTaskEdge;
    default:
      return undefined;
  }
};

export const pipelineGroupsComponentFactory = (kind: ModelKind, type: string) => {
  if (kind === ModelKind.graph) {
    return withPanZoom()(GraphComponent);
  }
  switch (type) {
    case 'Execution':
      return withSelection()(PipelineTaskGroup);
    case 'Task':
      return withSelection()(StandardTaskNode);
    case ICON_TASK_NODE_TYPE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return withSelection()(ArtifactTaskNode);
    case DEFAULT_SPACER_NODE_TYPE:
      return SpacerNode;
    case 'edge':
      return PipelineTaskEdge;
    default:
      return undefined;
  }
};

export default pipelineGroupsComponentFactory;
