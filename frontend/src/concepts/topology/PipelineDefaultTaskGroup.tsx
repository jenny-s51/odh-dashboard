import * as React from 'react';

import {
  LabelPosition,
  WithSelectionProps,
  isNode,
  DefaultTaskGroup,
  observer,
  Node,
  GraphElement,
} from '@patternfly/react-topology';
import PipelineTaskGroupCollapsed from './PipelineTaskGroupCollapsed';
import { NODE_HEIGHT, NODE_WIDTH } from './const';


type PipelinesDefaultGroupProps = {
  children?: React.ReactNode;
  element: GraphElement;
  onCollapseChange?: (group: Node, collapsed: boolean) => void;
} & WithSelectionProps;

type PipelinesDefaultGroupInnerProps = Omit<PipelinesDefaultGroupProps, 'element'> & {
  element: Node;
  onCollapseChange?: () => void;
};

const DefaultTaskGroupInner: React.FunctionComponent<PipelinesDefaultGroupInnerProps> = observer(
  ({ element, onCollapseChange, selected, onSelect, ...rest }) => {

    // TODO: remove when https://github.com/patternfly/react-topology/issues/171 merged
    if (element.isCollapsed()) {
      return (
        <PipelineTaskGroupCollapsed
          element={element}
          onCollapseChange={onCollapseChange}
          selected={selected}
          onSelect={onSelect}
          collapsible
          collapsedHeight={NODE_HEIGHT}
          collapsedWidth={NODE_WIDTH}
          {...rest}
        />
      );
    }
    return (
      <DefaultTaskGroup
        labelPosition={LabelPosition.top}
        element={element}
        collapsible
        onCollapseChange={onCollapseChange}
        selected={selected}
        onSelect={onSelect}
        collapsedHeight={NODE_HEIGHT}
        collapsedWidth={NODE_WIDTH}
        {...rest}
      />
    );
  },
);

const PipelineDefaultTaskGroup: React.FunctionComponent<PipelinesDefaultGroupProps> = ({
  element,
  onCollapseChange,
  ...rest
}: PipelinesDefaultGroupProps & WithSelectionProps) => {
  if (!isNode(element)) {
    throw new Error('DefaultTaskGroup must be used only on Node elements');
  }

  return <DefaultTaskGroupInner element={element} {...rest} />;
};

export default observer(PipelineDefaultTaskGroup);
