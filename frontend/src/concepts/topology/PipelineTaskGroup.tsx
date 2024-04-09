import * as React from 'react';
import {
  DEFAULT_EDGE_TYPE,
  DefaultTaskGroup, EdgeCreationTypes,
  GraphElement,
  LabelPosition,
  WithSelectionProps,
} from '@patternfly/react-topology';
import { NODE_HEIGHT, NODE_WIDTH } from '~/concepts/topology/const';

type PipelineTaskGroupProps = {
  element: GraphElement;
} & WithSelectionProps;

const getEdgeCreationTypes = (): EdgeCreationTypes => ({
  edgeType: DEFAULT_EDGE_TYPE,
  spacerEdgeType: DEFAULT_EDGE_TYPE,
});

const onCollapseChange = (element: GraphElement): void => {
  const controller = element.getController();
  const model = controller.toModel();
  console.log(model.nodes);
  console.log(model.edges);
};

const PipelineTaskGroup: React.FunctionComponent<PipelineTaskGroupProps> = ({
  element,
  selected,
  onSelect,
}) => (
  <DefaultTaskGroup
    element={element}
    selected={selected}
    onSelect={onSelect}
    labelPosition={LabelPosition.top}
    collapsible
    collapsedHeight={NODE_HEIGHT}
    collapsedWidth={NODE_WIDTH}
    recreateLayoutOnCollapseChange
    getEdgeCreationTypes={getEdgeCreationTypes}
    onCollapseChange={() => onCollapseChange(element)}
  />
);

export default PipelineTaskGroup;
