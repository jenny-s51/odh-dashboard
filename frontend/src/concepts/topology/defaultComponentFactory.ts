import { ComponentType } from 'react';
import { GraphElement, ComponentFactory, ModelKind, GraphComponent, DefaultNode } from '@patternfly/react-topology';
import MultiEdge from "./MultiEdge";
import GroupHull from "./GroupHull";
import Group from "./DefaultGroup";
import Edge from "./DefaultEdge";
import { DeafIcon } from "@patternfly/react-icons";
import DefaultEdge from "./DefaultEdge";

const defaultComponentFactory: ComponentFactory = (
  kind: ModelKind,
  type: string
): ComponentType<{ element: GraphElement }> => {
  switch (type) {
    case 'multi-edge':
      return MultiEdge;
    case 'group':
      return Group;
    case 'group-hull':
      return GroupHull;
    default:
      switch (kind) {
        case ModelKind.graph:
          return GraphComponent;
        case ModelKind.node:
          return DefaultNode;
        case ModelKind.edge:
          return DefaultEdge;
        default:
          // @ts-ignore
          return undefined;
      }
  }
};

export default defaultComponentFactory;
