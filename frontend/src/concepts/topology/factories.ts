import {
  FinallyNode,
  GraphComponent,
  withPanZoom,
  withSelection,
  GraphElement,
  ComponentFactory,
  ModelKind,
  DefaultNode,
  TaskNode,
  SpacerNode,
  DEFAULT_TASK_NODE_TYPE,
  DefaultTaskGroup,
  DEFAULT_SPACER_NODE_TYPE,
  DEFAULT_EDGE_TYPE,
  DEFAULT_FINALLY_NODE_TYPE,
} from '@patternfly/react-topology';
import TaskEdge from './TaskEdge';
import ArtifactNode from './customNodes/ArtifactNode';
import StyleGroup from './StyleGroup';
import PipelinesTaskNode from './customNodes/PipelinesTaskNode';
import DemoTaskGroupEdge from './TaskGroupEdge';
// import DefaultTaskGroup from "./customGroups/DefaultTaskGroup";
// Topology gap... their types have issues with Strict TS mode
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export const GROUPED_EDGE_TYPE = 'GROUPED_EDGE';

export const pipelineComponentFactory: ComponentFactory = (kind, type) => {
  if (kind === ModelKind.graph) {
    return withPanZoom()(GraphComponent);
  }
  switch (type) {
    case DEFAULT_TASK_NODE_TYPE:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return withSelection()(PipelinesTaskNode);
    case 'artifact-node':
      return withSelection()(ArtifactNode);
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
    case GROUPED_EDGE_TYPE:
      return DemoTaskGroupEdge;
    default:
      return undefined;
  }
};
