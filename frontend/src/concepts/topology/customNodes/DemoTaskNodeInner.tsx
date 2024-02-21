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
} from '@patternfly/react-topology';
import { TaskNodeProps } from '@patternfly/react-topology/dist/esm/pipelines/components/nodes/TaskNode';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-topology/src/css/topology-pipelines.css';
import React from 'react';
import IconSourceAnchor from "./IconSourceAnchor";

type DemoTaskNodeInnerProps = Omit<TaskNodeProps, 'element'> & { element: Node };

const DemoTaskNodeIcon: React.FC<DemoTaskNodeInnerProps> = observer(
  ({ element, statusIconSize = 32, selected, leadIcon, ...rest }) => {
    const statusBackgroundRadius = statusIconSize / 2 + 4;

    useAnchor(
      React.useCallback((node: Node) =>
          new IconSourceAnchor(node, statusIconSize),
        [statusIconSize]
      ),
      AnchorEnd.source
    );

    return (
      <g>
        <circle
          className="pf-topology-pipelines__pill-background"
          cx={statusBackgroundRadius}
          cy={statusBackgroundRadius}
          r={statusBackgroundRadius}
        />
        <g transform={`translate(4, 4)`}>
          <g
          // className={css(
          //   styles.topologyPipelinesStatusIcon,
          //   runStatusModifier,
          //   selected && 'pf-m-selected',
          //   (status === RunStatus.Running || status === RunStatus.InProgress) && styles.modifiers.spin
          // )}
          >
            {leadIcon}
          </g>
        </g>
      </g>
    );
};

const DemoTaskNodeInner: React.FC<DemoTaskNodeInnerProps> = ({ element, ...rest }) => {
    const [isHover, hoverRef] = useHover();
    return (
      <g className={css('pf-topology__pipelines__task-node')} ref={hoverRef}>
        {isHover ? <TaskNode element={element} hover scaleNode {...rest} /> : <DemoTaskNodeIcon element={element} {...rest} />}
      </g>
    );
  },
);

const DemoTaskNode: React.FC<TaskNodeProps> = ({ element, ...rest }) => {
  if (!isNode(element)) {
    throw new Error('DemoTaskNode must be used only on Node elements');
  }
  return <DemoTaskNodeInner element={element as Node} {...rest} />;
};

export default DemoTaskNode;
