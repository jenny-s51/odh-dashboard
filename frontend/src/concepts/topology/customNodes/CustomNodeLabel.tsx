import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-topology/src/css/topology-components';
import {
  LabelIcon,
  LabelBadge,
  LabelActionIcon,
  LabelContextMenu,
  BadgeLocation,
  LabelPosition,
  NodeStatus,
  NodeShadows,
  WithContextMenuProps,
  WithDndDragProps,
  createSvgIdUrl,
  useCombineRefs,
  useHover,
  useSize,
  truncateMiddle,
} from '@patternfly/react-topology';
import { Badge } from '@patternfly/react-core';
import '../css/custom-topology-components.css';

const NODE_SHADOW_FILTER_ID_HOVER = 'NodeShadowsFilterId--hover';
const NODE_SHADOW_FILTER_ID_DANGER = 'NodeShadowsFilterId--danger';

type NodeLabelProps = {
  children?: string;
  className?: string;
  paddingX?: number;
  paddingY?: number;
  x?: number;
  y?: number;
  position?: LabelPosition;
  cornerRadius?: number;
  status?: NodeStatus;
  secondaryLabel?: string;
  truncateLength?: number; // Defaults to 13
  labelIconClass?: string; // Icon to show in label
  labelIcon?: React.ReactNode;
  labelIconPadding?: number;
  isExpanded?: boolean;
  dragRef?: WithDndDragProps['dndDragRef'];
  hover?: boolean;
  dragging?: boolean;
  edgeDragging?: boolean;
  dropTarget?: boolean;
  actionIcon?: React.ReactElement;
  actionIconClassName?: string;
  onActionIconClick?: (e: React.MouseEvent) => void;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  badgeClassName?: string;
  badgeLocation?: BadgeLocation;
} & Partial<WithContextMenuProps>;

/**
 * Renders a `<text>` component with a `<rect>` box behind.
 */
const CustomNodeLabel: React.FunctionComponent<NodeLabelProps> = ({
  children,
  className,
  paddingX = 0,
  paddingY = 0,
  cornerRadius = 22,
  x = 0,
  y = 0,
  position = LabelPosition.bottom,
  secondaryLabel,
  status,
  badge,
  badgeColor,
  badgeTextColor,
  badgeBorderColor,
  badgeClassName,
  badgeLocation = BadgeLocation.inner,
  isExpanded = false,
  labelIconClass,
  labelIcon,
  labelIconPadding = 4,
  truncateLength,
  dragRef,
  hover,
  dragging,
  edgeDragging,
  dropTarget,
  onContextMenu,
  contextMenuOpen,
  actionIcon,
  actionIconClassName,
  onActionIconClick,
  ...other
}) => {
  const [labelHover, labelHoverRef] = useHover();
  const refs = useCombineRefs(
    dragRef,
    typeof truncateLength === 'number' ? labelHoverRef : undefined,
  );

  const [textSize, textRef] = useSize([children, truncateLength, className, labelHover]);
  const [secondaryTextSize, secondaryTextRef] = useSize([
    secondaryLabel,
    truncateLength,
    className,
    labelHover,
  ]);
  const [badgeSize, badgeRef] = useSize([badge]);
  const [actionSize, actionRef] = useSize([actionIcon, paddingX]);
  const [contextSize, contextRef] = useSize([onContextMenu, paddingX]);

  const {
    width,
    height,
    backgroundHeight,
    startX,
    startY,
    badgeStartX,
    badgeStartY,
    actionStartX,
    contextStartX,
    iconSpace,
    badgeSpace,
  } = React.useMemo(() => {
    if (!textSize) {
      return {
        width: 0,
        height: 0,
        backgroundHeight: 0,
        startX: 0,
        startY: 0,
        badgeStartX: 0,
        badgeStartY: 0,
        actionStartX: 0,
        contextStartX: 0,
        iconSpace: 0,
        badgeSpace: 0,
      };
    }
    const badgeSpace =
      badge && badgeSize && badgeLocation === BadgeLocation.inner ? badgeSize.width + paddingX : 0;
    const height = Math.max(textSize.height, badgeSize?.height ?? 0) + paddingY * 2;
    const iconSpace = labelIconClass || labelIcon ? (height + paddingY * 0.5) / 2 : 0;
    const actionSpace = actionIcon && actionSize ? actionSize.width : 0;
    const contextSpace = onContextMenu && contextSize ? contextSize.width : 0;
    const primaryWidth = iconSpace + badgeSpace + paddingX + textSize.width + paddingX;
    const secondaryWidth =
      secondaryLabel && secondaryTextSize ? secondaryTextSize.width + 2 * paddingX : 0;
    const width = Math.max(primaryWidth, secondaryWidth);
    const startX = position === x - width / 2 + iconSpace / 2;
    const startY = position === y;
    const actionStartX = iconSpace + badgeSpace + paddingX + textSize.width + paddingX;
    const contextStartX = actionStartX + actionSpace;
    const backgroundHeight =
      height + (secondaryLabel && secondaryTextSize ? secondaryTextSize.height + paddingY * 2 : 0);
    let badgeStartX = 0;
    let badgeStartY = 0;
    if (badgeSize) {
      if (badgeLocation === BadgeLocation.below) {
        badgeStartX = (width - badgeSize.width) / 2;
        badgeStartY = height + paddingY;
      } else {
        badgeStartX = iconSpace + paddingX;
        badgeStartY = -badgeSize.height / 2;
      }
    }

    return {
      width,
      height,
      backgroundHeight,
      startX,
      startY,
      actionStartX,
      contextStartX,
      badgeStartX,
      badgeStartY,
      iconSpace,
      badgeSpace: badgeSize && badgeLocation === BadgeLocation.inner ? badgeSpace : 0,
    };
  }, [
    textSize,
    badge,
    badgeSize,
    badgeLocation,
    paddingX,
    paddingY,
    labelIconClass,
    labelIcon,
    actionIcon,
    actionSize,
    onContextMenu,
    contextSize,
    secondaryLabel,
    secondaryTextSize,
    position,
    x,
    y,
  ]);

  let filterId;
  if (status === 'danger') {
    filterId = NODE_SHADOW_FILTER_ID_DANGER;
  } else if (hover || dragging || edgeDragging || dropTarget) {
    filterId = NODE_SHADOW_FILTER_ID_HOVER;
  }

  return (
    <>
      <g className={className} ref={refs} transform={`translate(${startX}, ${startY})`}>
        <NodeShadows />
        {textSize && (
          <>
            <rect
              className="pf-topology__group__border"
              x={0 - paddingX * 2}
              y={-height / 2 - paddingY * 2}
              width={actionStartX + paddingX + backgroundHeight}
              height={height + paddingY * 4}
              stroke-width={2}
              stroke={'gray'}
              fill="none"
              stroke-dasharray={4}
            />
            <rect
              className={css(styles.topologyNodeLabelBackground)}
              key={`rect-${filterId}`} // update key to force remount on filter update
              filter={filterId && createSvgIdUrl(filterId)}
              x={0}
              y={-height / 2}
              width={width}
              height={height}
              rx={cornerRadius}
              ry={cornerRadius}
            />
          </>
        )}
        {textSize && secondaryLabel && (
          <>
            <line
              className={css(styles.topologyNodeSeparator)}
              x1={0}
              y1={height}
              x2={width}
              y2={height}
              shapeRendering="crispEdges"
            />
            <text
              className="pf-m-secondary"
              ref={secondaryTextRef}
              x={width / 2}
              y={height + paddingY + (secondaryTextSize?.height ?? 0) / 2}
              dy="0.35em"
              textAnchor="middle"
            >
              {truncateLength > 0 && !labelHover
                ? truncateMiddle(secondaryLabel, { length: truncateLength })
                : secondaryLabel}
            </text>
          </>
        )}
        {textSize && (labelIconClass || labelIcon) && (
          <LabelIcon
            x={iconSpace}
            y={paddingY * -0.25}
            width={iconSpace * 2}
            height={iconSpace * 2}
            iconClass={labelIconClass}
            icon={labelIcon}
            padding={labelIconPadding}
          />
        )}
        <text {...other} ref={textRef} x={iconSpace + paddingX} y={0} dy="0.35em">
          {truncateLength > 0 && !labelHover
            ? truncateMiddle(children, { length: truncateLength })
            : children}
        </text>
        {textSize && badge && (
          <LabelBadge
            ref={badgeRef}
            x={iconSpace + textSize.width + paddingX * 2}
            y={badgeStartY}
            badge={badge}
            badgeClassName={badgeClassName}
            badgeColor={badgeColor}
            badgeTextColor={badgeTextColor}
            badgeBorderColor={badgeBorderColor}
          />
        )}
      </g>
      <rect
        className={isExpanded ? 'action-icon-expanded' : 'action-icon-collapsed'}
        key={`rect-${filterId}`} // update key to force remount on filter update
        filter={filterId && createSvgIdUrl(filterId)}
        x={actionStartX + paddingX}
        y={-height / 2}
        width={backgroundHeight}
        height={backgroundHeight}
      ></rect>
      <LabelActionIcon
        ref={actionRef}
        x={actionStartX + paddingX}
        y={-height / 2}
        height={backgroundHeight}
        paddingX={paddingX}
        paddingY={paddingY}
        icon={actionIcon}
        className={
          isExpanded
            ? 'action-icon-expanded'
            : 'action-icon-collapsed'
        }
        onClick={onActionIconClick}
      />
    </>
  );
};

export default CustomNodeLabel;
