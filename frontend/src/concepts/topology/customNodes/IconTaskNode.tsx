import React, { LegacyRef } from 'react';
import {
  TaskNode,
  DEFAULT_WHEN_OFFSET,
  Node,
  WhenDecorator,
  NodeModel,
  WithSelectionProps,
  observer,
  useAnchor,
  AnchorEnd,
  getRunStatusModifier,
  ScaleDetailsLevel,
  useScaleNode,
  getNodeScaleTranslation,
  action,
  isNode,
  useHover,
  RunStatus,
} from '@patternfly/react-topology';
import { StandardTaskNodeData } from '~/concepts/topology/types';
import { ListIcon, MonitoringIcon } from '@patternfly/react-icons';
import { TaskNodeProps } from '@patternfly/react-topology/dist/esm/pipelines/components/nodes/TaskNode';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-topology/src/css/topology-pipelines.css';
import IconSourceAnchor from './IconSourceAnchor';
import '../css/custom-topology-components.css';

type IconTaskNodeInnerProps = WithSelectionProps & {
  element: Node<NodeModel, StandardTaskNodeData>;
} & Omit<TaskNodeProps, 'element'> & { element: Node };

const IconTaskNode: React.FC<IconTaskNodeInnerProps> = observer(
  ({ element, statusIconSize = 16, selected, status, onSelect, leadIcon, scaleNode, ...rest }) => {
    const statusBackgroundRadius = statusIconSize / 2 + 4;
    const scale = element.getGraph().getScale();
    const height = element.getBounds().height;
    const upScale = 1 / scale;

    const runStatusModifier = status && getRunStatusModifier(status);
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
        <g
          transform={
            detailsLevel !== ScaleDetailsLevel.high ? `translate(4, 4)` : `translate(18, 14)`
          }
        >
          <g className="pf-topology-pipelines__artifact-icon">{leadIcon}</g>
        </g>
      </g>
    );
  },
);

const SCALE_UP_TIME = 200;

const IconTaskNodeInner: React.FC<IconTaskNodeInnerProps> = ({
  element,
  scaleNode = false,
  ...rest
}) => {
  const [isHover, hoverRef] = useHover();
  const detailsLevel = element.getGraph().getDetailsLevel();
  const data = element.getData();

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

  const whenDecorator = data?.whenStatus ? (
    <WhenDecorator element={element} status={data.whenStatus} leftOffset={DEFAULT_WHEN_OFFSET} />
  ) : null;

  return (
    <g
      className={css('pf-topology__pipelines__task-node')}
      ref={hoverRef as LegacyRef<SVGGElement>}
    >
      {isHover ? (
        <TaskNode
          nameLabelClass="artifact-node-label"
          truncateLength={30}
          element={element}
          hover
          scaleNode
          {...rest}
        >
          {whenDecorator}
        </TaskNode>
      ) : (
        <IconTaskNode
          leadIcon={data?.artifactType === 'system.Metrics' ? <MonitoringIcon /> : <ListIcon />}
          selected
          element={element}
          {...rest}
        >
          {whenDecorator}
        </IconTaskNode>
      )}
    </g>
  );
};

const ArtifactTaskNode: React.FC<TaskNodeProps> = ({ element, ...rest }) => {
  if (!isNode(element)) {
    throw new Error('DemoTaskNode must be used only on Node elements');
  }
  return <IconTaskNodeInner element={element as Node} {...rest} />;
};

export default ArtifactTaskNode;
