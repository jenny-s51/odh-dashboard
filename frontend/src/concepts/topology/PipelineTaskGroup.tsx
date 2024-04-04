import * as React from 'react';
import { observer } from 'mobx-react';
import {
  AnchorEnd,
  DefaultTaskGroup,
  GraphElement,
  isNode,
  LabelPosition,
  Node,
  useAnchor,
  WithContextMenuProps,
  WithSelectionProps,
  ShapeProps,
  WithDragNodeProps,
  EdgeCreationTypes,
  ScaleDetailsLevel,
  TaskNodeSourceAnchor,
  TaskNodeTargetAnchor,
} from '@patternfly/react-topology';
import TaskGroupSourceAnchor from './TaskGroupSourceAnchor';
import TaskGroupTargetAnchor from './TaskGroupTargetAnchor';

type PipelineTaskGroupProps = {
  element: GraphElement;
  collapsible?: boolean;
  collapsedWidth?: number;
  collapsedHeight?: number;
  onCollapseChange?: (group: Node, collapsed: boolean) => void;
  getCollapsedShape?: (node: Node) => React.FunctionComponent<ShapeProps>;
  collapsedShadowOffset?: number; // defaults to 10
} & WithContextMenuProps &
  WithDragNodeProps &
  WithSelectionProps;

export const DEFAULT_TASK_WIDTH = 180;
export const DEFAULT_TASK_HEIGHT = 32;

const getEdgeCreationTypes = (): EdgeCreationTypes => ({
  edgeType: 'edge',
  spacerEdgeType: 'edge',
});

const PipelineTaskGroup: React.FunctionComponent<PipelineTaskGroupProps> = ({
  element,
  ...rest
}) => {
  useAnchor(
    React.useCallback(
      (node: Node) => new TaskNodeSourceAnchor(node, ScaleDetailsLevel.high, 0, true),
      [],
    ),
    AnchorEnd.source,
  );
  useAnchor(
    React.useCallback(
      (node: Node) => new TaskNodeTargetAnchor(node, 0, ScaleDetailsLevel.high, 0, true),
      [],
    ),
    AnchorEnd.target,
  );
  if (!isNode(element)) {
    return null;
  }
  return (
    <DefaultTaskGroup
      labelPosition={LabelPosition.top}
      collapsedWidth={DEFAULT_TASK_WIDTH}
      collapsedHeight={DEFAULT_TASK_HEIGHT}
      element={element as Node}
      recreateLayoutOnCollapseChange
      getEdgeCreationTypes={getEdgeCreationTypes}
      {...rest}
    />
  );
};

export default observer(PipelineTaskGroup);
