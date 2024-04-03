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
  useHover,
  TaskNodeSourceAnchor,
  TaskNodeTargetAnchor,
} from '@patternfly/react-topology';
import { ListIcon, MonitoringIcon } from '@patternfly/react-icons';
import { TaskNodeProps } from '@patternfly/react-topology/dist/esm/pipelines/components/nodes/TaskNode';
import { css } from '@patternfly/react-styles';
import { StandardTaskNodeData } from '~/concepts/topology/types';
import '~/concepts/topology/css/custom-topology-components.css';

const ICON_PADDING = 8;

type IconTaskNodeProps = {
  element: Node<NodeModel, StandardTaskNodeData>;
} & WithSelectionProps;

const IconTaskNode: React.FC<IconTaskNodeProps> = observer(({ element, selected, onSelect }) => {
  const data = element.getData();
  const status = data?.status;
  const bounds = element.getBounds();
  const iconSize = bounds.height - ICON_PADDING * 2;
  const leadIcon =
    data?.artifactType === 'system.Metrics' ? (
      <MonitoringIcon width={iconSize} height={iconSize} />
    ) : (
      <ListIcon width={iconSize} height={iconSize} />
    );

  const runStatusModifier = status && getRunStatusModifier(status);

  useAnchor(
    React.useCallback(
      (node: Node) => new TaskNodeSourceAnchor(node, ScaleDetailsLevel.high, 0, true),
      [],
    ),
    AnchorEnd.source,
  );
  useAnchor(
    React.useCallback(
      (node: Node) => new TaskNodeTargetAnchor(node, 0, ScaleDetailsLevel.high, 0, true),
      [],
    ),
    AnchorEnd.target,
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
    >
      <rect
        className="pf-topology-pipelines__pill-background"
        x={0}
        y={0}
        width={bounds.width}
        height={bounds.height}
        rx={bounds.height / 2}
      />
      <g
        transform={`translate(${(bounds.width - iconSize) / 2}, ${ICON_PADDING})`}
        className="pf-topology-pipelines__artifact-icon"
      >
        {leadIcon}
      </g>
    </g>
  );
});

type ArtifactTaskNodeInnerProps = WithSelectionProps & {
  element: Node<NodeModel, StandardTaskNodeData>;
} & Omit<TaskNodeProps, 'element'> & { element: Node };

const IconTaskNodeInner: React.FC<ArtifactTaskNodeInnerProps> = observer(
  ({ element, selected, onSelect, ...rest }) => {
    const [isHover, hoverRef] = useHover();
    const detailsLevel = element.getGraph().getDetailsLevel();
    const data = element.getData();

    const whenDecorator = data?.whenStatus ? (
      <WhenDecorator element={element} status={data.whenStatus} leftOffset={DEFAULT_WHEN_OFFSET} />
    ) : null;

    return (
      <g
        className={css('pf-topology__pipelines__task-node')}
        ref={hoverRef as LegacyRef<SVGGElement>}
      >
        {isHover || detailsLevel !== ScaleDetailsLevel.high ? (
          <TaskNode
            nameLabelClass="artifact-node-label"
            hideDetailsAtMedium
            truncateLength={30}
            element={element}
            hover
            selected={selected}
            onSelect={onSelect}
            status={data?.status}
            scaleNode={isHover}
            {...rest}
          >
            {whenDecorator}
          </TaskNode>
        ) : (
          <IconTaskNode selected={selected} onSelect={onSelect} element={element} />
        )}
      </g>
    );
  },
);

const ArtifactTaskNode: React.FC<TaskNodeProps> = ({ element, ...rest }) => (
  <IconTaskNodeInner element={element as Node} {...rest} />
);

export default ArtifactTaskNode;
