import * as React from 'react';

import {
  BadgeLocation,
  ConnectDragSource,
  ConnectDropTarget,
  Dimensions,
  GraphElement,
  LabelPosition,
  OnSelect,
  ShapeProps,
  WithDndDragProps,
  WithSelectionProps,
  getEdgesFromNodes,
  getSpacerNodes,
  isNode,
  DefaultTaskGroup,
  observer,
  Node,
} from '@patternfly/react-topology';
import PipelineTaskGroupCollapsed from './PipelineTaskGroupCollapsed';
import { NODE_HEIGHT, NODE_WIDTH } from './const';

export interface EdgeCreationTypes {
  spacerNodeType?: string;
  edgeType?: string;
  spacerEdgeType?: string;
  finallyNodeTypes?: string[];
  finallyEdgeType?: string;
}

interface PipelinesDefaultGroupProps {
  /** Additional content added to the node */
  children?: React.ReactNode;
  /** Additional classes added to the group */
  className?: string;
  /** The graph group node element to represent */
  element: GraphElement;
  /** Flag if the user is hovering on the node */
  hover?: boolean;
  /** Flag if the group is collapsible */
  collapsible?: boolean;
  /** Width of the collapsed group */
  collapsedWidth?: number;
  /** Height of the collapsed group */
  collapsedHeight?: number;
  /** Callback when the group is collapsed */
  onCollapseChange?: (group: Node, collapsed: boolean) => void;
  /** Shape of the collapsed group */
  getCollapsedShape?: (node: Node) => React.FunctionComponent<ShapeProps>;
  /** Flag if the element selected. Part of WithSelectionProps */
  selected?: boolean;
  /** Function to call when the element should become selected (or deselected). Part of WithSelectionProps */
  onSelect?: OnSelect;
  /** Flag to recreate the layout when the group is expanded/collapsed. Be sure you are registering "pipelineElementFactory" when set to true. */
  recreateLayoutOnCollapseChange?: boolean;
  /** Function to return types used to re-create edges on a group collapse/expand (should be the same as calls to getEdgesFromNodes) */
  getEdgeCreationTypes?: () => {
    spacerNodeType?: string;
    edgeType?: string;
    spacerEdgeType?: string;
    finallyNodeTypes?: string[];
    finallyEdgeType?: string;
  };
}

type PipelinesDefaultGroupInnerProps = Omit<PipelinesDefaultGroupProps, 'element'> & {
  element: Node;
} & WithSelectionProps;

const DefaultTaskGroupInner: React.FunctionComponent<PipelinesDefaultGroupInnerProps> = observer(
  ({
    className,
    element,
    onCollapseChange,
    recreateLayoutOnCollapseChange,
    getEdgeCreationTypes,
    selected,
    onSelect,
    ...rest
  }) => {
    const childCount = element.getAllNodeChildren().length;
    const data = element.getData();

    const handleCollapse = (group: Node, collapsed: boolean): void => {
      if (collapsed && rest.collapsedWidth !== undefined && rest.collapsedHeight !== undefined) {
        group.setDimensions(new Dimensions(rest.collapsedWidth, rest.collapsedHeight));
      }
      group.setCollapsed(collapsed);

        const controller = group.hasController() && group.getController();
        if (controller) {
          const model = controller.toModel();
          const creationTypes: EdgeCreationTypes = getEdgeCreationTypes
            ? getEdgeCreationTypes()
            : {};

          const pipelineNodes = model
            .nodes!.filter((n) => n.type !== creationTypes.spacerNodeType)
            .map((n) => ({
              ...n,
              visible: true,
            }));
          const spacerNodes = getSpacerNodes(
            pipelineNodes,
            creationTypes.spacerNodeType,
            creationTypes.finallyNodeTypes,
          );
          const nodes = [...pipelineNodes, ...spacerNodes];
          const edges = getEdgesFromNodes(
            pipelineNodes,
            creationTypes.spacerNodeType,
            creationTypes.edgeType,
            creationTypes.edgeType,
            creationTypes.finallyNodeTypes,
            creationTypes.finallyEdgeType,
          );
          controller.fromModel({ nodes, edges }, true);
          controller.getGraph().layout();
        }

      onCollapseChange && onCollapseChange(group, collapsed);
    };

    if (element.isCollapsed()) {
      return (
        <PipelineTaskGroupCollapsed
          className={className}
          element={element}
          onCollapseChange={handleCollapse}
          badge={`${childCount}`}
          badgeColor="#f5f5f5"
          badgeBorderColor="#d2d2d2"
          badgeTextColor="#000000"
          status={data?.status}
          selected={selected}
          onSelect={onSelect}
          labelPosition={LabelPosition.top}
          collapsible
          showStatusState
          collapsedHeight={NODE_HEIGHT}
          collapsedWidth={NODE_WIDTH}
          {...rest}
        />
      );
    }
    return (
      <DefaultTaskGroup
        className={className}
        labelPosition={LabelPosition.top}
        element={element}
        collapsible
        onCollapseChange={handleCollapse}
        selected={selected}
        onSelect={onSelect}
        badgeColor="#f5f5f5"
        badgeBorderColor="#d2d2d2"
        badgeTextColor="#000000"
        {...rest}
      />
    );
  },
);

const PipelineDefaultTaskGroup: React.FunctionComponent<PipelinesDefaultGroupProps> = ({
  element,
  ...rest
}: PipelinesDefaultGroupProps) => {
  if (!isNode(element)) {
    throw new Error('DefaultTaskGroup must be used only on Node elements');
  }

  return <DefaultTaskGroupInner element={element} {...rest} />;
};

export default PipelineDefaultTaskGroup;
