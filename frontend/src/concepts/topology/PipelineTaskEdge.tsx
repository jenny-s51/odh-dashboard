import * as React from 'react';
import { observer } from 'mobx-react';
import { DEFAULT_SPACER_NODE_TYPE, Edge, EdgeTerminalType, GraphElement, TaskEdge } from '@patternfly/react-topology';

interface PipelineTaskEdgeProps {
  element: Edge;
  className?: string;
  nodeSeparation?: number;
}

const PipelineTaskEdge: React.FunctionComponent<PipelineTaskEdgeProps> = ({
  element,
  className,
  nodeSeparation,
  ...props
}) => {
  return (
    <TaskEdge element={element as Edge} endTerminalType={element.getTarget().getType() !== DEFAULT_SPACER_NODE_TYPE ? EdgeTerminalType.directional : undefined} {...props} />
  );
};

export default observer(PipelineTaskEdge);
