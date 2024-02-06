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
  DefaultTaskGroup,
  DEFAULT_TASK_NODE_TYPE,
  DEFAULT_SPACER_NODE_TYPE,
  DEFAULT_EDGE_TYPE,
  DEFAULT_FINALLY_NODE_TYPE,
  ContextMenuSeparator,
  ContextMenuItem,
  withContextMenu,
} from '@patternfly/react-topology';
import StandardTaskNode from '~/concepts/topology/customNodes/CustomTaskNode';
import CustomTaskNode from "./customNodes/TaskNode";
import DemoTaskNode from "./DemoTaskNode";
import TaskEdge from './TaskEdge';
import CustomTaskEdge from "./CustomTaskEdge";
import TaskNode from "./customNodes/TaskNode";
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
      return withSelection()(TaskNode);
    case DEFAULT_SPACER_NODE_TYPE:
      return SpacerNode;
    case 'finally-group':
      return DefaultTaskGroup;
    case 'task-group':
      return withSelection()(DefaultTaskGroup);
    case DEFAULT_FINALLY_NODE_TYPE:
      return FinallyNode;
    case DEFAULT_EDGE_TYPE:
      return TaskEdge;
    default:
      return undefined;
  }
};

// import DemoTaskGroupEdge from './TaskGroupEdge';
// import { ComponentType } from "react";
// import DemoTaskNode from "./DemoTaskNode";

// export const GROUPED_EDGE_TYPE = 'GROUPED_EDGE';

// export const pipelineComponentFactory2: ComponentFactory = (
//   kind: ModelKind,
//   type: string,
// ): React.ComponentType<{ element: GraphElement }> | undefined => {
//   if (kind === ModelKind.graph) {
//     return withPanZoom()(GraphComponent);
//   }
//   switch (type) {
//     case DEFAULT_TASK_NODE_TYPE:
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       return withSelection()(DemoTaskNode);
//     case DEFAULT_FINALLY_NODE_TYPE:
//       return withSelection()(FinallyNode);
//     case 'task-group':
//       return DefaultTaskGroup;
//     case 'finally-group':
//       return DefaultTaskGroup;
//     case DEFAULT_SPACER_NODE_TYPE:
//       return SpacerNode;
//     case 'finally-spacer-edge':
//     case DEFAULT_EDGE_TYPE:
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       return TaskEdge;
//     case GROUPED_EDGE_TYPE:
//       return DemoTaskGroupEdge;
//     default:
//       return undefined;
//   }
// };
