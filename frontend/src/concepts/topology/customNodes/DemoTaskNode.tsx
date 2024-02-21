import * as React from 'react';
import { observer } from 'mobx-react';
import {
  DEFAULT_LAYER,
  DEFAULT_WHEN_OFFSET,
  GraphElement,
  Layer,
  Node,
  RunStatus,
  ScaleDetailsLevel,
  TaskNode,
  TOP_LAYER,
  useHover,
  WhenDecorator,
  WithContextMenuProps,
  WithSelectionProps
} from '@patternfly/react-topology';
import { PopoverProps } from '@patternfly/react-core';
import DemoTaskNodeInner from "./DemoTaskNodeInner";

type DemoTaskNodeProps = {
  element: GraphElement;
} & WithContextMenuProps & WithSelectionProps;

const DEMO_TIP_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id feugiat augue, nec fringilla turpis.';

const DemoTaskNode: React.FunctionComponent<DemoTaskNodeProps> = ({
  element,
  onContextMenu,
  contextMenuOpen,
  ...rest
}) => {
  const nodeElement = element as Node;
  const data = element.getData();
  const [hover, hoverRef] = useHover();
  const detailsLevel = element.getGraph().getDetailsLevel();

  const passedData = React.useMemo(() => {
    const newData = { ...data };
    Object.keys(newData).forEach(key => {
      if (newData[key] === undefined) {
        delete newData[key];
      }
    });
    return newData;
  }, [data]);

  const hasTaskIcon = !!(data.taskIconClass || data.taskIcon);
  const whenDecorator = data.whenStatus ? (
    <WhenDecorator
      element={element}
      leftOffset={hasTaskIcon ? DEFAULT_WHEN_OFFSET + (nodeElement.getBounds().height - 4) * 0.75 : DEFAULT_WHEN_OFFSET}
    />
  ) : null;

  // Set the badgePopoverParams, but if the node has badgeTooltips, this will be ignored
  const badgePopoverParams: PopoverProps = {
    headerContent: nodeElement.getLabel(),
    bodyContent: DEMO_TIP_TEXT,
    footerContent: 'Popover footer'
  };

  return (
    <Layer id={detailsLevel !== ScaleDetailsLevel.high && hover ? TOP_LAYER : DEFAULT_LAYER}>
      <g ref={hoverRef}>
        <DemoTaskNodeInner
          element={element}
          scaleNode={hover && detailsLevel !== ScaleDetailsLevel.high}
          hideDetailsAtMedium
          hiddenDetailsShownStatuses={[RunStatus.Running, RunStatus.Succeeded, RunStatus.Failed, RunStatus.Cancelled]}
          {...passedData}
          {...rest}
          badgePopoverParams={badgePopoverParams}
          badgeTooltip={data.badgeTooltips && DEMO_TIP_TEXT}
        >
          {whenDecorator}
        </DemoTaskNodeInner>
      </g>
    </Layer>
  );
};

export default observer(DemoTaskNode);
