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
  ScaleDetailsLevel,
  useHover,
  Layer,
  DEFAULT_LAYER,
  TOP_LAYER,
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
  const [hover, hoverRef] = useHover();
  const detailsLevel = element.getGraph().getDetailsLevel();

  return (
    <Layer id={detailsLevel !== ScaleDetailsLevel.high && hover ? TOP_LAYER : DEFAULT_LAYER}>
      <g ref={hoverRef as React.LegacyRef<SVGGElement>}>
        <TaskNode
          element={element}
          actionIcon={collapsible ? <ExpandIcon /> : undefined}
          onActionIconClick={() => onCollapseChange!(element, false)}
          shadowCount={2}
          hiddenDetailsShownStatuses={[RunStatus.Succeeded]}
          scaleNode={hover && detailsLevel !== ScaleDetailsLevel.high}
          hideDetailsAtMedium
          showStatusState
          {...rest}
        />
      </g>
    </Layer>
  );
};

export default observer(PipelineTaskGroupCollapsed);
