import * as React from 'react';

import {
  Dimensions,
  LabelPosition,
  OnSelect,
  WithSelectionProps,
  getEdgesFromNodes,
  getSpacerNodes,
  isNode,
  DefaultTaskGroup,
  observer,
  Node,
  GraphElement,
  action,
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
  children?: React.ReactNode;
  className?: string;
  element: GraphElement;
  hover?: boolean;
  collapsible?: boolean;
  collapsedWidth?: number;
  collapsedHeight?: number;
  onCollapseChange?: (group: Node, collapsed: boolean) => void;
  selected?: boolean;
  onSelect?: OnSelect;
  recreateLayoutOnCollapseChange?: boolean;
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
  ({ className, element, getEdgeCreationTypes, selected, onSelect, ...rest }) => {
    const childCount = element.getAllNodeChildren().length;
    const data = element.getData();

    const handleCollapse = action((group: Node, collapsed: boolean): void => {
      if (collapsed && rest.collapsedWidth !== undefined && rest.collapsedHeight !== undefined) {
        group.setDimensions(new Dimensions(rest.collapsedWidth, rest.collapsedHeight));
      }
      group.setCollapsed(collapsed);

      const controller = group.hasController() && group.getController();
      if (controller) {
        const model = controller.toModel();
        const creationTypes: EdgeCreationTypes = getEdgeCreationTypes ? getEdgeCreationTypes() : {};

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
    });

    if (element.isCollapsed()) {
      return (
        <PipelineTaskGroupCollapsed
          className={className}
          element={element}
          onCollapseChange={handleCollapse}
          badge={`${childCount}`}
          status={data?.status}
          selected={selected}
          onSelect={onSelect}
          collapsible
          hideDetailsAtMedium
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
