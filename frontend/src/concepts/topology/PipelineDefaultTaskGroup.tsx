import * as React from 'react';

import {
  LabelPosition,
  WithSelectionProps,
  isNode,
  DefaultTaskGroup,
  observer,
  Node,
  GraphElement,
  RunStatus,
  DEFAULT_LAYER,
  Layer,
  ScaleDetailsLevel,
  TOP_LAYER,
  NodeModel,
  useHover,
  PipelineNodeModel,
} from '@patternfly/react-topology';
import { Flex, FlexItem, Popover, Stack, StackItem } from '@patternfly/react-core';
import { PipelineNodeModelExpanded, StandardTaskNodeData } from '~/concepts/topology/types';
import NodeStatusIcon from '~/concepts/topology/NodeStatusIcon';
import { NODE_HEIGHT, NODE_WIDTH } from './const';

type PipelinesDefaultGroupProps = {
  element: GraphElement<PipelineNodeModelExpanded>;
} & WithSelectionProps;

type PipelinesDefaultGroupInnerProps = Omit<PipelinesDefaultGroupProps, 'element'> & {
  element: Node<PipelineNodeModel, StandardTaskNodeData>;
};

const DefaultTaskGroupInner: React.FunctionComponent<PipelinesDefaultGroupInnerProps> = observer(
  ({ element, selected, onSelect }) => {
    const [hover, hoverRef] = useHover();
    const popoverRef = React.useRef<SVGGElement>(null);
    const detailsLevel = element.getGraph().getDetailsLevel();

    const getPopoverTasksList = (items: Node<NodeModel>[]) => (
      <Stack hasGutter>
        {items.map((item: Node) => (
          <StackItem key={item.getId()}>
            <Flex gap={{ default: 'gapXs' }}>
              <FlexItem>
                <NodeStatusIcon runStatus={item.getData()?.runStatus} />
              </FlexItem>
              <FlexItem>{item.getLabel()}</FlexItem>
            </Flex>
          </StackItem>
        ))}
      </Stack>
    );

    const groupNode = (
      <DefaultTaskGroup
        labelPosition={LabelPosition.top}
        element={element}
        collapsible
        recreateLayoutOnCollapseChange
        selected={selected}
        onSelect={onSelect}
        hideDetailsAtMedium
        showStatusState
        scaleNode={hover && detailsLevel !== ScaleDetailsLevel.high}
        status={element.getData()?.runStatus}
        hiddenDetailsShownStatuses={[
          RunStatus.Succeeded,
          RunStatus.Pending,
          RunStatus.Failed,
          RunStatus.Cancelled,
        ]}
        collapsedHeight={NODE_HEIGHT}
        collapsedWidth={NODE_WIDTH}
      />
    );

    console.log("get all node children", element.getAllNodeChildren());

    return (
      <Layer id={detailsLevel !== ScaleDetailsLevel.high && hover ? TOP_LAYER : DEFAULT_LAYER}>
        <g ref={hoverRef as React.LegacyRef<SVGGElement>}>
          {element.isCollapsed() ? (
            <Popover
              triggerRef={popoverRef}
              triggerAction="hover"
              aria-label="Hoverable popover"
              headerContent={element.getLabel()}
              bodyContent={getPopoverTasksList(element.getAllNodeChildren())}
            >
              <g ref={popoverRef}>{groupNode}</g>
            </Popover>
          ) : (
            groupNode
          )}
        </g>
      </Layer>
    );
  },
);

const PipelineDefaultTaskGroup: React.FunctionComponent<PipelinesDefaultGroupProps> = ({
  element,
  ...rest
}: PipelinesDefaultGroupProps & WithSelectionProps) => {
  if (!isNode(element)) {
    throw new Error('DefaultTaskGroup must be used only on Node elements');
  }

  return <DefaultTaskGroupInner element={element} {...rest} />;
};

export default observer(PipelineDefaultTaskGroup);
