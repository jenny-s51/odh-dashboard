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
} from '@patternfly/react-topology';
import { Icon, Popover } from '@patternfly/react-core';
import { NODE_HEIGHT, NODE_WIDTH } from './const';
import { getNodeStatusIcon } from './utils';

type PipelinesDefaultGroupProps = {
  element: GraphElement;
} & WithSelectionProps;

type PipelinesDefaultGroupInnerProps = Omit<PipelinesDefaultGroupProps, 'element'> & {
  element: Node;
};

const DefaultTaskGroupInner: React.FunctionComponent<PipelinesDefaultGroupInnerProps> = observer(
  ({ element, selected, onSelect }) => {
    const [hover, hoverRef] = useHover();
    const popoverRef = React.useRef();
    const detailsLevel = element.getGraph().getDetailsLevel();

    const getPopoverTasksList = (items: Node<NodeModel>[]) =>
      items.map((item: Node) => (
        <div key={item.getId()}>
          <Icon status={getNodeStatusIcon(item.getData()?.status).status} isInline>
            {getNodeStatusIcon(item.getData()?.status).icon}
          </Icon>
          {item.getId()}
        </div>
      ));

    return (
      <Layer id={detailsLevel !== ScaleDetailsLevel.high && hover ? TOP_LAYER : DEFAULT_LAYER}>
        <g ref={hoverRef as React.LegacyRef<SVGGElement>}>
          <Popover
            triggerRef={popoverRef}
            triggerAction="hover"
            aria-label="Hoverable popover"
            headerContent={element.getLabel()}
            bodyContent={getPopoverTasksList(element.getAllNodeChildren())}
          >
            <g ref={popoverRef as unknown as React.LegacyRef<SVGGElement>}>
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
                status={element.getData()?.status}
                hiddenDetailsShownStatuses={[
                  RunStatus.Succeeded,
                  RunStatus.Pending,
                  RunStatus.Failed,
                  RunStatus.Cancelled,
                ]}
                collapsedHeight={NODE_HEIGHT}
                collapsedWidth={NODE_WIDTH}
              />
            </g>
          </Popover>
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
