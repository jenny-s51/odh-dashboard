import * as React from 'react';
import { observer } from 'mobx-react';
import { polygonHull } from 'd3-polygon';
import * as _ from 'lodash';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-topology/src/css/topology-components';
import CollapseIcon from '@patternfly/react-icons/dist/esm/icons/compress-alt-icon';
import {
  BadgeLocation,
  Layer,
  Node,
  NodeLabel,
  useDragNode,
  useSvgAnchor,
  WithContextMenuProps,
  WithDndDropProps,
  WithDragNodeProps,
  WithSelectionProps,
  CollapsibleGroupProps,
  hullPath,
  maxPadding,
  useCombineRefs,
  useHover,
  Rect,
  GROUPS_LAYER,
  TOP_LAYER,
  NodeShape,
  NodeStyle,
  PointTuple,
  isGraph,
} from '@patternfly/react-topology';
import CustomNodeLabel from "../customNodes/CustomNodeLabel";

type DefaultGroupExpandedProps = {
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
  truncateLength?: number; // Defaults to 13
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  badgeClassName?: string;
  badgeLocation?: BadgeLocation;
  labelIconClass?: string; // Icon to show in label
  labelIcon?: string;
  labelIconPadding?: number;
  hulledOutline?: boolean;
} & CollapsibleGroupProps &
  WithDragNodeProps &
  WithSelectionProps &
  WithDndDropProps &
  WithContextMenuProps;

type PointWithSize = [number, number, number];

// Return the point whose Y is the largest value.
// If multiple points are found, compute the center X between them
// export for testing only
export function computeLabelLocation(points: PointWithSize[]): PointWithSize {
  let lowPoints: PointWithSize[];
  const threshold = 5;

  _.forEach(points, (p) => {
    const delta = !lowPoints ? Infinity : Math.round(p[1]) - Math.round(lowPoints[0][1]);
    if (delta > threshold) {
      lowPoints = [p];
    } else if (Math.abs(delta) <= threshold) {
      lowPoints.push(p);
    }
  });
  return [
    (_.minBy(lowPoints, (p) => p[0])[0] + _.maxBy(lowPoints, (p) => p[0])[0]) / 2,
    lowPoints[0][1],
    // use the max size value
    _.maxBy(lowPoints, (p) => p[2])[2],
  ];
}

const PipelinesDefaultGroupExpanded: React.FunctionComponent<DefaultGroupExpandedProps> = ({
  className,
  element,
  collapsible,
  selected,
  onSelect,
  hover,
  label,
  secondaryLabel,
  showLabel = true,
  truncateLength,
  dndDropRef,
  droppable,
  canDrop,
  dropTarget,
  onContextMenu,
  contextMenuOpen,
  dragging,
  dragNodeRef,
  badge,
  badgeColor,
  badgeTextColor,
  badgeBorderColor,
  badgeClassName,
  badgeLocation,
  labelIconClass,
  labelIcon,
  labelIconPadding,
  onCollapseChange,
  hulledOutline = true,
}) => {
  const [hovered, hoverRef] = useHover();
  const [labelHover, labelHoverRef] = useHover();
  const dragLabelRef = useDragNode()[1];
  const refs = useCombineRefs<SVGPathElement>(hoverRef as React.Ref<SVGPathElement>, dragNodeRef as React.Ref<SVGPathElement>);
  const isHover = hover !== undefined ? hover : hovered;
  const anchorRef = useSvgAnchor();
  const outlineRef = useCombineRefs(dndDropRef as React.Ref<Element>, anchorRef);
  const labelLocation = React.useRef<PointWithSize>();
  const pathRef = React.useRef<string>();
  const boxRef = React.useRef<Rect | null>(null);

  let parent = element.getParent();
  let altGroup = false;
  while (!isGraph(parent)) {
    altGroup = !altGroup;
    parent = parent.getParent();
  }

  // cast to number and coerce
  const padding = maxPadding(element.getStyle<NodeStyle>().padding ?? 17);
  const hullPadding = (point: PointWithSize | PointTuple) => (point[2] || 0) + padding;

  if (
    !droppable ||
    (hulledOutline && !pathRef.current) ||
    (!hulledOutline && !boxRef.current) ||
    !labelLocation.current
  ) {
    const children = element.getNodes().filter((c) => c.isVisible());
    if (children.length === 0) {
      return null;
    }
    const points: (PointWithSize | PointTuple)[] = [];
    _.forEach(children, (c) => {
      if (c.getNodeShape() === NodeShape.circle) {
        const bounds = c.getBounds();
        const { width, height } = bounds;
        const { x, y } = bounds.getCenter();
        const radius = Math.max(width, height) / 2;
        points.push([x, y, radius] as PointWithSize);
      } else {
        // add all 4 corners
        const { width, height, x, y } = c.getBounds();
        points.push([x, y, 0] as PointWithSize);
        points.push([x + width, y, 0] as PointWithSize);
        points.push([x, y + height, 0] as PointWithSize);
        points.push([x + width, y + height, 0] as PointWithSize);
      }
    });

    if (hulledOutline) {
      const hullPoints: (PointWithSize | PointTuple)[] =
        points.length > 2 ? polygonHull(points as PointTuple[]) : (points as PointTuple[]);
      if (!hullPoints) {
        return null;
      }

      // change the box only when not dragging
      pathRef.current = hullPath(hullPoints as PointTuple[], hullPadding);

      // Compute the location of the group label.
      labelLocation.current = computeLabelLocation(hullPoints as PointWithSize[]);
    } else {
      boxRef.current = element.getBounds();
      labelLocation.current = [
        boxRef.current.x + boxRef.current.width / 2,
        boxRef.current.y + boxRef.current.height,
        0,
      ];
    }
  }

  const groupClassName = css(
    styles.topologyGroup,
    className,
    altGroup && 'pf-m-alt-group',
    canDrop && 'pf-m-highlight',
    dragging && 'pf-m-dragging',
    selected && 'pf-m-selected',
  );
  const innerGroupClassName = css(
    styles.topologyGroup,
    className,
    altGroup && 'pf-m-alt-group',
    canDrop && 'pf-m-highlight',
    dragging && 'pf-m-dragging',
    selected && 'pf-m-selected',
    (isHover || labelHover) && 'pf-m-hover',
    canDrop && dropTarget && 'pf-m-drop-target',
  );

  return (
    <g
      ref={labelHoverRef as React.Ref<SVGGElement>}
      onContextMenu={onContextMenu}
      onClick={onSelect}
      className={groupClassName}
    >
      <Layer id={GROUPS_LAYER}>
        <g
          ref={refs}
          onContextMenu={onContextMenu}
          onClick={onSelect}
          className={innerGroupClassName}
        >
          {hulledOutline ? (
            <path ref={outlineRef as React.LegacyRef<SVGPathElement>} className={styles.topologyGroupBackground} d={pathRef.current} />
          ) : (
            <rect
              ref={outlineRef as React.LegacyRef<SVGRectElement>}
              className={styles.topologyGroupBackground}
              x={boxRef.current?.x}
              y={boxRef.current?.y}
              width={boxRef.current?.width}
              height={boxRef.current?.height}
            />
          )}
        </g>
      </Layer>
      {showLabel && (label || element.getLabel()) && (
        <Layer id={isHover ? TOP_LAYER : undefined}>
          <CustomNodeLabel
            // className={styles.topologyGroupLabel}
            x={labelLocation.current[0]}
            y={
              labelLocation.current[1] +
              (hulledOutline ? hullPadding(labelLocation.current) : 0) +
              24
            }
            paddingX={8}
            paddingY={5}
            dragRef={dragNodeRef ? dragLabelRef : undefined}
            status={element.getNodeStatus()}
            secondaryLabel={secondaryLabel}
            truncateLength={truncateLength}
            badge={badge}
            badgeColor={badgeColor}
            badgeTextColor={badgeTextColor}
            badgeBorderColor={badgeBorderColor}
            badgeClassName={badgeClassName}
            badgeLocation={badgeLocation}
            labelIconClass={labelIconClass}
            labelIcon={labelIcon}
            labelIconPadding={labelIconPadding}
            onContextMenu={onContextMenu}
            contextMenuOpen={contextMenuOpen}
            hover={isHover || labelHover}
            actionIcon={collapsible ? <CollapseIcon /> : undefined}
            isExpanded
            onActionIconClick={() => onCollapseChange(element, true)}
          >
            {label || element.getLabel()}
          </CustomNodeLabel>
        </Layer>
      )}
    </g>
  );
};

export default observer(PipelinesDefaultGroupExpanded);
