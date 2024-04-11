import * as React from 'react';
import { observer } from 'mobx-react';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-alt-icon';
import {
  RunStatus,
  LabelPosition,
  BadgeLocation,
  CollapsibleGroupProps,
  TaskNode,
  WithContextMenuProps,
  WithDndDropProps,
  WithDragNodeProps,
  WithSelectionProps,
  Node,
} from '@patternfly/react-topology';

type PipelineTaskGroupCollapsedProps = {
  children?: React.ReactNode;
  className?: string;
  element: Node;
  droppable?: boolean;
  canDrop?: boolean;
  dropTarget?: boolean;
  dragging?: boolean;
  hover?: boolean;
  label?: string; // Defaults to element.getLabel()
  secondaryLabel?: string;
  showLabel?: boolean; // Defaults to true
  status?: RunStatus;
  statusIconSize?: number;
  showStatusState?: boolean;
  scaleNode?: boolean;
  hideDetailsAtMedium?: boolean;
  hiddenDetailsShownStatuses?: RunStatus[];
  labelPosition?: LabelPosition; // Defaults to bottom
  truncateLength?: number; // Defaults to 13
  labelIconClass?: string; // Icon to show in label
  labelIcon?: string;
  labelIconPadding?: number;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  badgeClassName?: string;
  badgeLocation?: BadgeLocation;
} & CollapsibleGroupProps &
  WithDragNodeProps &
  WithSelectionProps &
  WithDndDropProps &
  WithContextMenuProps;

const PipelineTaskGroupCollapsed: React.FunctionComponent<PipelineTaskGroupCollapsedProps> = ({
  element,
  collapsible,
  onCollapseChange,
  ...rest
}) => {
  return (
    <TaskNode
      element={element}
      actionIcon={collapsible ? <ExpandIcon /> : undefined}
      // onActionIconClick={() => onCollapseChange(element, false)}
      shadowCount={2}
      {...rest}
    />
  );
};

export default observer(PipelineTaskGroupCollapsed);
