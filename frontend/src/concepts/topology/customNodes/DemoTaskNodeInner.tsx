import { Tooltip } from '@patternfly/react-core';
import {
  RunStatus,
  StatusIcon,
  useHover,
  observer,
  Node,
  isNode,
  TaskNode,
  EllipseAnchor,
  useAnchor,
  AnchorEnd,
  Point,
  AbstractAnchor,
  getRunStatusModifier,
  ScaleDetailsLevel,
  useScaleNode,
  getNodeScaleTranslation,
  action,
} from '@patternfly/react-topology';
import { TaskNodeProps } from '@patternfly/react-topology/dist/esm/pipelines/components/nodes/TaskNode';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-topology/src/css/topology-pipelines.css';
import React from 'react';
import IconSourceAnchor from './IconSourceAnchor';
import '../css/custom-topology-components.css';

type DemoTaskNodeInnerProps = Omit<TaskNodeProps, 'element'> & { element: Node };

const DemoTaskNodeIcon: React.FC<DemoTaskNodeInnerProps> = observer(
  ({ element, statusIconSize = 16, selected, status, onSelect, leadIcon, scaleNode, ...rest }) => {
    const statusBackgroundRadius = statusIconSize / 2 + 4;
    const scale = element.getGraph().getScale();
    const height = element.getBounds().height;
    const upScale = 1 / scale;

    const runStatusModifier = getRunStatusModifier(status);
    const detailsLevel = element.getGraph().getDetailsLevel();

    useAnchor(
      React.useCallback(
        (node: Node) => new IconSourceAnchor(node, statusIconSize),
        [statusIconSize],
      ),
      AnchorEnd.source,
    );

    return (
      <g
        className={css(
          'pf-topology-pipelines__pill',
          runStatusModifier,
          selected && 'pf-m-selected',
          onSelect && 'pf-m-selectable',
        )}
        onClick={onSelect}
        transform={
          detailsLevel !== ScaleDetailsLevel.high
            ? `translate(0, ${
                (height - statusBackgroundRadius * 2 * upScale) / 2
              }) scale(${upScale})`
            : undefined
        }
        // ref={taskRef}
      >
        {detailsLevel !== ScaleDetailsLevel.high ? (
          <circle
            className="pf-topology-pipelines__pill-background"
            cx={statusBackgroundRadius}
            cy={statusBackgroundRadius}
            r={statusBackgroundRadius}
          />
        ) : (
          <rect
            x={0}
            y={0}
            width={54}
            height={44}
            rx={44 / 2}
            className="pf-topology-pipelines__pill-background"
          />
        )}
        <g transform={detailsLevel !== ScaleDetailsLevel.high ? `translate(4, 4)` : `translate(18, 14)`}>
          <g className={css(styles.topologyPipelinesStatusIcon)}>{leadIcon}</g>
        </g>
      </g>
    );
  },
);

const SCALE_UP_TIME = 200;

const DemoTaskNodeInner: React.FC<DemoTaskNodeInnerProps> = ({ element, scaleNode, ...rest }) => {
  const [isHover, hoverRef] = useHover();
  const detailsLevel = element.getGraph().getDetailsLevel();

  React.useEffect(() => {
    action(() => {
      const sourceEdges = element.getSourceEdges();
      sourceEdges.forEach((edge) => {
        const data = edge.getData();
        edge.setData({ ...(data || {}), indent: detailsLevel === ScaleDetailsLevel.high ? 40 : 0 });
      });
    })();
  }, [detailsLevel, element]);

  const scale = element.getGraph().getScale();
  const nodeScale = useScaleNode(scaleNode, scale, SCALE_UP_TIME);
  const { translateX, translateY } = getNodeScaleTranslation(element, nodeScale, scaleNode);

  return (
    <g
      className={css('pf-topology__pipelines__task-node')}
      ref={hoverRef}
    >
      {isHover ? (
        <TaskNode truncateLength={25} element={element} hover scaleNode {...rest} />
      ) : (
        <DemoTaskNodeIcon selected element={element} {...rest} />
      )}
    </g>
  );
};

const DemoTaskNode: React.FC<TaskNodeProps> = ({ element, ...rest }) => {
  if (!isNode(element)) {
    throw new Error('DemoTaskNode must be used only on Node elements');
  }
  return <DemoTaskNodeInner element={element as Node} {...rest} />;
};

export default DemoTaskNode;
