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
} from '@patternfly/react-topology';
import StandardTaskNode from '~/concepts/topology/customNodes/StandardTaskNode';
import { ICON_TASK_NODE_TYPE } from './utils';
import ArtifactTaskNode from './customNodes/ArtifactTaskNode';
import PipelineTaskEdge from './PipelineTaskEdge';
import PipelineDefaultTaskGroup from './PipelineDefaultTaskGroup';
import { EXECUTION_TASK_NODE_TYPE } from "./const";

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

export const pipelineGroupsComponentFactory: ComponentFactory = (kind, type) => {
  if (kind === ModelKind.graph) {
    return withPanZoom()(GraphComponent);
  }
  switch (type) {
    case EXECUTION_TASK_NODE_TYPE:
      return withSelection()(PipelineDefaultTaskGroup);
    case DEFAULT_TASK_NODE_TYPE:
      return withSelection()(StandardTaskNode);
    case ICON_TASK_NODE_TYPE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return withSelection()(ArtifactTaskNode);
    case DEFAULT_SPACER_NODE_TYPE:
      return SpacerNode;
    case DEFAULT_EDGE_TYPE:
      return PipelineTaskEdge;
    default:
      return undefined;
  }
};
