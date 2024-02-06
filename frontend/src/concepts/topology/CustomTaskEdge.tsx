import * as React from 'react';
import { observer } from 'mobx-react';
import {
  Edge,
  EdgeConnectorArrow,
  EdgeTerminalType,
  GraphElement,
  Layer,
  Point,
  useBendpoint,
  WithRemoveConnectorProps,
  WithSourceDragProps,
  WithTargetDragProps
} from '@patternfly/react-topology';

type EdgeProps = {
  element: GraphElement;
  dragging?: boolean;
} & WithSourceDragProps &
  WithTargetDragProps &
  WithRemoveConnectorProps;

interface BendpointProps {
  point: Point;
}

const Bendpoint: React.FunctionComponent<BendpointProps> = observer(({ point }) => {
  const [hover, setHover] = React.useState(false);
  const [, ref] = useBendpoint(point);
  return (
    <circle
      ref={ref}
      cx={point.x}
      cy={point.y}
      r={5}
      fill="lightblue"
      fillOpacity={hover ? 0.8 : 0}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    />
  );
});

const CustomTaskEdge: React.FunctionComponent<EdgeProps> = ({
  element,
  sourceDragRef,
  targetDragRef,
  dragging,
  onShowRemoveConnector,
  onHideRemoveConnector
}) => {
  const edgeElement = element as Edge;
  const startPoint = edgeElement.getStartPoint();
  const endPoint = edgeElement.getEndPoint();
  const midPoint = new Point((endPoint.x + startPoint.x) / 2, (endPoint.y + startPoint.y) / 2);
  const midPointY = (endPoint.y + startPoint.y) / 2;
  const midPointX = (endPoint.x + startPoint.x) / 2;
  const midStartPoint = new Point(midPointX, startPoint.y);
  const midEndPoint = new Point(midPointX, endPoint.y);
  const bendpoints = edgeElement.getBendpoints();
  const d = `M${midStartPoint.x} ${midStartPoint.y} ${bendpoints.map((b: Point) => `L${b.x} ${b.y} `).join('')}L${
    midEndPoint.x
  } ${midEndPoint.y}`;

  return (
    <>
      <Layer id={dragging ? 'top' : undefined}>
        <path
          strokeWidth={1}
          stroke={(element.getData() && element.getData().color) || 'red'}
          d={d}
          fill="none"
          onMouseEnter={onShowRemoveConnector}
          onMouseLeave={onHideRemoveConnector}
        />
        {sourceDragRef && <circle ref={sourceDragRef} r={8} cx={midPointX} cy={midPointY} fillOpacity={0} />}
        <EdgeConnectorArrow dragRef={targetDragRef} edge={edgeElement} terminalType={EdgeTerminalType.directional} />
      </Layer>
      {bendpoints && bendpoints.map((p, i) => <Bendpoint point={p} key={i.toString()} />)}
    </>
  );
};

export default observer(CustomTaskEdge);
