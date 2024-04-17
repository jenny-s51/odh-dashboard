import * as React from 'react';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-alt-icon';
import {
  RunStatus,
  LabelPosition,
  CollapsibleGroupProps,
  TaskNode,
  WithSelectionProps,
  Node,
  ScaleDetailsLevel,
  useHover,
  Layer,
  DEFAULT_LAYER,
  TOP_LAYER,
  NodeModel,
  observer,
  Dimensions,
  action,
  getEdgesFromNodes,
  getSpacerNodes,
} from '@patternfly/react-topology';
import { Icon, Popover } from '@patternfly/react-core';
import { getNodeStatusIcon } from './utils';

type PipelineTaskGroupCollapsedProps = {
  children?: React.ReactNode;
  element: Node;
  hideDetailsAtMedium?: boolean;
} & CollapsibleGroupProps &
  WithSelectionProps;

const PipelineTaskGroupCollapsed: React.FunctionComponent<PipelineTaskGroupCollapsedProps> = ({
  element,
  collapsible,
  onCollapseChange,
  hideDetailsAtMedium,
  ...rest
}) => {
  const [hover, hoverRef] = useHover();
  const myRef = React.useRef();
  const detailsLevel = element.getGraph().getDetailsLevel();

  const childCount = element.getAllNodeChildren().length;


  const getPopoverTasksList = (items: Node<NodeModel>[]) =>
    items.map((item: Node) => (
      <div key={item.getId()}>
        <Icon status={getNodeStatusIcon(item.getData()?.status).status} isInline>
          {getNodeStatusIcon(item.getData()?.status).icon}
        </Icon>
        {item.getId()}
      </div>
    ));

    const handleCollapse = action((group: Node, collapsed: boolean): void => {
      if (collapsed && rest.collapsedWidth !== undefined && rest.collapsedHeight !== undefined) {
        group.setDimensions(new Dimensions(rest.collapsedWidth, rest.collapsedHeight));
      }
      group.setCollapsed(collapsed);

      const controller = group.hasController() && group.getController();
      if (controller) {
        const model = controller.toModel();

        const pipelineNodes = model
          .nodes!.filter((n) => n.type)
          .map((n) => ({
            ...n,
            visible: true,
          }));
        const spacerNodes = getSpacerNodes(
          pipelineNodes,
        );
        const nodes = [...pipelineNodes, ...spacerNodes];
        const edges = getEdgesFromNodes(
          pipelineNodes,
        );
        controller.fromModel({ nodes, edges }, true);
        controller.getGraph().layout();
      }
    });

  return (
    <Layer id={detailsLevel !== ScaleDetailsLevel.high && hover ? TOP_LAYER : DEFAULT_LAYER}>
      <g ref={hoverRef as React.LegacyRef<SVGGElement>}>
        <Popover
          triggerRef={myRef}
          triggerAction="hover"
          aria-label="Hoverable popover"
          headerContent={element.getLabel()}
          bodyContent={getPopoverTasksList(element.getAllNodeChildren())}
        >
          <g ref={myRef as unknown as React.LegacyRef<SVGGElement>}>
            <TaskNode
              element={element}
              hideDetailsAtMedium
              actionIcon={collapsible ? <ExpandIcon /> : undefined}
              onActionIconClick={() => handleCollapse(element, false)}
              shadowCount={2}
              hiddenDetailsShownStatuses={[RunStatus.Succeeded]}
              scaleNode={hover && detailsLevel !== ScaleDetailsLevel.high}
              showStatusState
              badge={`${childCount}`}
              status={element.getData().status}
              {...rest}
            />
          </g>
        </Popover>
      </g>
    </Layer>
  );
};

export default observer(PipelineTaskGroupCollapsed);
