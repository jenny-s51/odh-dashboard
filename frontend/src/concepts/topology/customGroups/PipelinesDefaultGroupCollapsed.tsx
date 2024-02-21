import * as React from 'react';
import { observer } from 'mobx-react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-topology/src/css/topology-components';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-alt-icon';
import {
  BadgeLocation,
  Ellipse,
  LabelPosition,
  Layer,
  Node,
  NodeLabel,
  LabelBadge,
  CollapsibleGroupProps,
  useDragNode,
  WithContextMenuProps,
  WithDndDropProps,
  WithDragNodeProps,
  WithSelectionProps,
  createSvgIdUrl,
  useCombineRefs,
  useHover,
  useSize,
  GROUPS_LAYER,
  Stadium,
} from '@patternfly/react-topology';
import { NODE_SHADOW_FILTER_ID_HOVER } from '@patternfly/react-topology/dist/esm/components/nodes/NodeShadows';
import CustomNodeLabel from '../customNodes/CustomNodeLabel';
import '../css/custom-topology-components.css';
import { Button, Popover } from '@patternfly/react-core';

type DefaultGroupCollapsedProps = {
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

const PipelinesDefaultGroupCollapsed: React.FunctionComponent<DefaultGroupCollapsedProps> = ({
  className,
  element,
  collapsible,
  selected,
  onSelect,
  children,
  hover,
  label,
  secondaryLabel,
  showLabel = true,
  truncateLength,
  collapsedWidth,
  collapsedHeight = 42,
  getCollapsedShape,
  onCollapseChange,
  collapsedShadowOffset = 8,
  dndDropRef,
  dragNodeRef,
  canDrop,
  dropTarget,
  onContextMenu,
  contextMenuOpen,
  dragging,
  labelPosition,
  badge,
  badgeColor,
  badgeTextColor,
  badgeBorderColor,
  badgeClassName,
  badgeLocation,
  labelIconClass,
  labelIcon,
  labelIconPadding,
}) => {
  const [hovered, hoverRef] = useHover();
  const [labelHover, labelHoverRef] = useHover();
  const dragLabelRef = useDragNode()[1];
  const [shapeSize, shapeRef] = useSize([collapsedWidth, collapsedHeight]);
  const refs = useCombineRefs<SVGPathElement>(hoverRef, dragNodeRef, shapeRef);
  const isHover = hover !== undefined ? hover : hovered;
  const childCount = element.getAllNodeChildren().length;
  const [badgeSize, badgeRef] = useSize([childCount]);
  const badgeLabelTriggerRef = React.useRef();
  const myRef = React.useRef();

  const groupClassName = css(
    styles.topologyGroup,
    className,
    canDrop && 'pf-m-highlight',
    canDrop && dropTarget && 'pf-m-drop-target',
    dragging && 'pf-m-dragging',
    selected && 'pf-m-selected',
  );

  const ShapeComponent = getCollapsedShape ? getCollapsedShape(element) : Stadium;
  const filter =
    isHover || dragging || dropTarget ? createSvgIdUrl(NODE_SHADOW_FILTER_ID_HOVER) : undefined;

  return (
    <g
      ref={labelHoverRef}
      onContextMenu={onContextMenu}
      onClick={onSelect}
      className={groupClassName}
    >
      {/* <Layer>
        <g ref={refs} onClick={onSelect}>
          <> */}
      {/* <g transform={`translate(${collapsedShadowOffset * 2}, ${-collapsedHeight / 2})`}>
              <rect
                className={css(styles.topologyNodeBackground, 'pf-m-disabled')}
                x={0}
                y={0}
                width={collapsedWidth}
                height={collapsedHeight}
                rx={22}
                ry={22}
              />
            </g> */}
      // TODO : uncomment the block below to keep the collapsed offset nodes... may need design
      input
      {/* <g transform={`translate(${collapsedShadowOffset}, ${-collapsedHeight / 2})`}>
              <rect
                className={css(styles.topologyNodeBackground, 'pf-m-disabled')}
                x={collapsedWidth}
                y={0}
                width={collapsedWidth}
                height={collapsedHeight}
                rx={22}
                ry={22}
              />
            </g>
            <rect
              className={css(styles.topologyNodeLabelBackground, 'pf-m-disabled')}
              x={collapsedWidth}
              y={-collapsedHeight / 2}
              width={collapsedWidth}
              height={collapsedHeight}
              rx={22}
              ry={22}
            />
          </>
        </g> */}
      {/* </Layer> */}
      {/* {shapeSize && childCount && (
        <LabelBadge
          className={styles.topologyGroupCollapsedBadge}
          ref={badgeRef}
          x={shapeSize.width - 8}
          y={(shapeSize.width - (badgeSize?.height ?? 0)) / 2}
          badge={`${childCount}`}
          badgeColor={badgeColor}
          badgeTextColor={badgeTextColor}
          badgeBorderColor={badgeBorderColor}
        />
      )} */}
      {showLabel && (
        <Popover
          triggerRef={myRef}
          triggerAction="hover"
          aria-label="Hoverable popover"
          headerContent={element.getLabel()}
          bodyContent={<div>This popover opens on hover.</div>}
          footerContent="Popover footer"
        >
          <g ref={myRef}>
            <CustomNodeLabel
              className={styles.topologyGroupLabel}
              x={0}
              y={-collapsedHeight / 2}
              paddingX={8}
              paddingY={5}
              dragRef={dragNodeRef ? dragLabelRef : undefined}
              status={element.getNodeStatus()}
              secondaryLabel={secondaryLabel}
              truncateLength={truncateLength}
              badge={badge}
              badgeLocation={badgeLocation}
              badgeColor={badgeColor}
              badgeTextColor={badgeTextColor}
              badgeBorderColor={badgeBorderColor}
              badgeClassName={badgeClassName}
              labelIconClass={labelIconClass}
              labelIcon={labelIcon}
              labelIconPadding={labelIconPadding}
              onContextMenu={onContextMenu}
              contextMenuOpen={contextMenuOpen}
              hover={isHover || labelHover}
              actionIcon={collapsible ? <ExpandIcon /> : undefined}
              onActionIconClick={() => onCollapseChange(element, false)}
            >
              {label || element.getLabel()}
            </CustomNodeLabel>
          </g>
        </Popover>
      )}
      {/* {children} */}
    </g>
  );
};

export default observer(PipelinesDefaultGroupCollapsed);
