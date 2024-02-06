import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-topology/src/css/topology-components';
import {
  observer,
  Edge,
  integralShapePath,
  DEFAULT_SPACER_NODE_TYPE,
  ConnectorArrow,
  EllipseAnchor,
  useAnchor,
  Point,
} from '@patternfly/react-topology';
// import { integralShapeTopDown } from "./IntegralShapeTopDown";
import { start } from "repl";
interface TaskEdgeProps {
  element: Edge;
  className?: string;
  nodeSeparation?: number;
}

const TaskEdge: React.FunctionComponent<TaskEdgeProps> = ({
  element,
  className,
  nodeSeparation,
}) => {
  const startPoint = element.getStartPoint();
  const endPoint = element.getEndPoint();
  // const midPoint = new Point((endPoint.x + startPoint.x) / 2, (endPoint.y + startPoint.y) / 2);
  // const midPointY = (endPoint.y + startPoint.y) / 2;
  // const midPointX = (endPoint.x + startPoint.x) / 2;
  // const midStartPoint = new Point(midPointX, startPoint.y);
  // const midEndPoint = new Point(midPointX, endPoint.y);
  const groupClassName = css(styles.topologyEdge, className);
  const startIndent: number = element.getData()?.indent || 0;
  const testEnd = new Point(endPoint.x, endPoint.y + 100)

  return (
    <g data-test-id="task-handler" className={groupClassName}>
      <path
        fillOpacity={0}
        d={integralShapePath(startPoint, endPoint, startIndent, nodeSeparation)}
        shapeRendering="geometricPrecision"
      />

      {element.getTarget().getType() !== DEFAULT_SPACER_NODE_TYPE ? (
        <ConnectorArrow
          className={styles.topologyEdge}
          startPoint={endPoint.clone().translate(-1, 0)}
          endPoint={endPoint}
        />
      ) : null}
    </g>
  );
};

export default observer(TaskEdge);
