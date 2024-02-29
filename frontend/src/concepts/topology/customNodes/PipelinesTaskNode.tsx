import * as React from 'react';
import { observer } from 'mobx-react';
import {
  DEFAULT_LAYER,
  GraphElement,
  Layer,
  Node,
  RunStatus,
  ScaleDetailsLevel,
  TaskNode,
  TOP_LAYER,
  useHover,
  WithContextMenuProps,
  WithSelectionProps,
} from '@patternfly/react-topology';
import { PopoverProps } from '@patternfly/react-core';

type PipelinesTaskNodeProps = {
  element: GraphElement;
} & WithContextMenuProps &
  WithSelectionProps;

const DEMO_TIP_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id feugiat augue, nec fringilla turpis.';

const PipelinesTaskNode: React.FunctionComponent<PipelinesTaskNodeProps> = ({
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
    Object.keys(newData).forEach((key) => {
      if (newData[key] === undefined) {
        delete newData[key];
      }
    });
    return newData;
  }, [data]);

  const hasTaskIcon = !!(data.taskIconClass || data.taskIcon);

  // Set the badgePopoverParams, but if the node has badgeTooltips, this will be ignored
  const badgePopoverParams: PopoverProps = {
    headerContent: 'Popover header',
    bodyContent: DEMO_TIP_TEXT,
    footerContent: 'Popover footer',
  };

  return (
    <Layer id={detailsLevel !== ScaleDetailsLevel.high && hover ? TOP_LAYER : DEFAULT_LAYER}>
      <g ref={hoverRef}>
        <TaskNode
          element={element}
          onContextMenu={data.showContextMenu ? onContextMenu : undefined}
          contextMenuOpen={contextMenuOpen}
          scaleNode={(hover || contextMenuOpen) && detailsLevel !== ScaleDetailsLevel.high}
          hideDetailsAtMedium
          hiddenDetailsShownStatuses={[
            RunStatus.Succeeded,
            RunStatus.Failed,
            RunStatus.Cancelled,
            RunStatus.Running,
          ]}
          {...passedData}
          {...rest}
          badgePopoverParams={badgePopoverParams}
          badgeTooltip={data.badgeTooltips && DEMO_TIP_TEXT}
        ></TaskNode>
      </g>
    </Layer>
  );
};

export default observer(PipelinesTaskNode);
