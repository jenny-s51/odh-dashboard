import {
  FinallyNode,
  GraphComponent,
  withPanZoom,
  withSelection,
  GraphElement,
  ComponentFactory,
  ModelKind,
  DefaultNode,
  SpacerNode,
  DEFAULT_TASK_NODE_TYPE,
  DefaultTaskGroup,
  DEFAULT_SPACER_NODE_TYPE,
  DEFAULT_EDGE_TYPE,
  DEFAULT_FINALLY_NODE_TYPE,
} from '@patternfly/react-topology';
import TaskEdge from './TaskEdge';
import DemoTaskNode from './customNodes/DemoTaskNode';
import PipelinesDefaultGroup from './customGroups/PipelinesDefaultGroup';
import StyleGroup from './StyleGroup';
// import DefaultTaskGroup from "./customGroups/DefaultTaskGroup";
// Topology gap... their types have issues with Strict TS mode
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export const pipelineComponentFactory: ComponentFactory = (kind, type) => {
  if (kind === ModelKind.graph) {
    return withPanZoom()(GraphComponent);
  }
  switch (type) {
    case DEFAULT_TASK_NODE_TYPE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      // TODO: differentiate bw taksnodes that always show pill vs always lead icon
      // case 'leadicon-node:'
      return withSelection()(DemoTaskNode);
    case DEFAULT_SPACER_NODE_TYPE:
      return SpacerNode;
    case 'finally-group':
      return DefaultTaskGroup;
    case 'task-group':
      return withSelection()(StyleGroup);
    case DEFAULT_FINALLY_NODE_TYPE:
      return FinallyNode;
    case DEFAULT_EDGE_TYPE:
      return TaskEdge;
    default:
      return undefined;
  }
};
