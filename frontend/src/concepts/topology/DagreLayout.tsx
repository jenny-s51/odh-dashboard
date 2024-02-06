import { NodeModel, NodeShape, LabelPosition, useComponentFactory, useModel } from "@patternfly/react-topology";
import { DataTypes } from "~/api";
import { createNode } from "./utils";
import defaultComponentFactory from "./defaultcomponentFactory";

export const createGroupedGroupNodes = (
  groupId: string,
  x = 0,
  y = 100,
  hover: boolean = undefined,
  selected: boolean = undefined
): NodeModel[] => {
  const nodes: NodeModel[] = [];
  nodes.push(
    createNode({
      id: `${groupId}-Grouped-1`,
      shape: NodeShape.ellipse,
      label: 'Grouped Node 1',
      labelPosition: LabelPosition.bottom,
      row: 0,
      column: 0,
      x: x + 75,
      y,
      dataType: DataTypes.Alternate
    })
  );
  nodes.push(
    createNode({
      id: `${groupId}-Grouped-2`,
      shape: NodeShape.ellipse,
      label: 'Grouped Node 2',
      labelPosition: LabelPosition.bottom,
      row: 0,
      column: 0,
      x: x + 225,
      y,
      dataType: DataTypes.Alternate
    })
  );

  const groupNode = {
    id: groupId,
    type: 'group',
    label: 'Grouped Group Title',
    children: nodes.map(n => n.id),
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      hover,
      selected,
      collapsedWidth: 75,
      collapsedHeight: 75
    }
  };

  return [...nodes, groupNode];
};



export const GroupedGroupsStyles = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);
  const groupedGroupNodes: NodeModel[] = createGroupedGroupNodes('GroupedGroup');
  const ungroupedGroupNodes: NodeModel[] = createUnGroupedGroupNodes('Group 1');

  const groupNode = {
    id: 'Group 1',
    type: 'group',
    label: 'Node Group Title',
    children: ['GroupedGroup', ...ungroupedGroupNodes.map(n => n.id)],
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      collapsedWidth: 75,
      collapsedHeight: 75,
      showContextMenu: true,
      // labelIconClass: logos.get('icon-java')
    }
  };

  const groupedGroupNodes2: NodeModel[] = createGroupedGroupNodes('GroupedGroup2', 500);
  const ungroupedGroupNodes2: NodeModel[] = createUnGroupedGroupNodes('Group 2', 500);

  const groupNode2 = {
    id: 'Group 2',
    type: 'group',
    label: 'Node Group Title',
    children: ['GroupedGroup2', ...ungroupedGroupNodes2.map(n => n.id)],
    group: true,
    style: { padding: 17 },
    data: {
      badge: 'Label',
      badgeColor: '#F2F0FC',
      badgeTextColor: '#5752d1',
      badgeBorderColor: '#CBC1FF',
      collapsedWidth: 75,
      collapsedHeight: 75,
      selected: true,
      showContextMenu: true,
      labelIconClass: logos.get('icon-jenkins')
    }
  };

  useModel({
    graph: {
      id: 'g1',
      type: 'graph'
    },
    nodes: [
      ...groupedGroupNodes,
      ...ungroupedGroupNodes,
      groupNode,
      ...groupedGroupNodes2,
      ...ungroupedGroupNodes2,
      groupNode2
    ]
  });
  return null;
});
