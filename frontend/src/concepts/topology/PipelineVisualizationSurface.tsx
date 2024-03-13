import React from 'react';
import {
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  getEdgesFromNodes,
  PipelineNodeModel,
  TopologyControlBar,
  TopologyView,
  useVisualizationController,
  VisualizationSurface,
  getSpacerNodes,
  TOP_TO_BOTTOM,
  PipelineDagreLayout,
  Graph,
  LEFT_TO_RIGHT,
  Layout,
  NODE_SEPARATION_HORIZONTAL,
} from '@patternfly/react-topology';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { PIPELINE_LAYOUT, PIPELINE_NODE_SEPARATION_VERTICAL } from "./const";
import { GROUPED_PIPELINE_NODE_SEPARATION_HORIZONTAL } from "./TaskGroupEdge";
import { pipelineComponentFactory } from "./factories";

type PipelineVisualizationSurfaceProps = {
  nodes: PipelineNodeModel[];
  selectedIds?: string[];
};

const PipelineVisualizationSurface: React.FC<PipelineVisualizationSurfaceProps> = ({
  nodes,
  selectedIds,
}) => {
  const controller = useVisualizationController();
  const [error, setError] = React.useState<Error | null>();
  React.useEffect(() => {
    // PF Bug
    // TODO: Pipeline Topology weirdly doesn't set a width and height on spacer nodes -- but they do when using finally spacer nodes
    const spacerNodes = getSpacerNodes(nodes).map((s) => ({ ...s, width: 1, height: 1 }));
    const renderNodes = [...spacerNodes, ...nodes];
    // TODO: We can have a weird edge issue if the node is off by a few pixels vertically from the center
    const edges = getEdgesFromNodes(renderNodes);
    try {
      controller.registerComponentFactory(pipelineComponentFactory);
      controller.registerLayoutFactory(
        (type: string, graph: Graph): Layout | undefined =>
          new PipelineDagreLayout(graph, {
            nodesep: PIPELINE_NODE_SEPARATION_VERTICAL,
            rankdir: TOP_TO_BOTTOM,
            // ranksep:
            //   type === GROUPED_PIPELINE_LAYOUT ? GROUPED_PIPELINE_NODE_SEPARATION_HORIZONTAL : NODE_SEPARATION_HORIZONTAL,
            //   type.startsWith(GROUP_PREFIX) ? GROUPED_PIPELINE_NODE_SEPARATION_HORIZONTAL : NODE_SEPARATION_HORIZONTAL,
            ignoreGroups: true
          })
      );
      controller.fromModel(
        {
          graph: {
            layout: PIPELINE_LAYOUT,
            id: 'g1',
            type: 'graph'
          },
          nodes: renderNodes,
          edges,
        },
        true,
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        // eslint-disable-next-line no-console
        console.error('Unknown error occurred rendering Pipeline Graph', error);
      }
    }
  }, [controller, nodes]);
  if (error) {
    return (
      <EmptyState data-id="error-empty-state">
        <EmptyStateHeader
          titleText="Incorrect pipeline definition"
          icon={<EmptyStateIcon icon={ExclamationCircleIcon} />}
          headingLevel="h4"
        />
        <EmptyStateBody>{error.message}</EmptyStateBody>
      </EmptyState>
    );
  }

  return (
    <TopologyView
      controlBar={
        <TopologyControlBar
          controlButtons={createTopologyControlButtons({
            ...defaultControlButtonsOptions,
            zoomInCallback: action(() => {
              controller.getGraph().scaleBy(4 / 3);
            }),
            zoomOutCallback: action(() => {
              controller.getGraph().scaleBy(0.75);
            }),
            fitToScreenCallback: action(() => {
              controller.getGraph().fit(80);
            }),
            resetViewCallback: action(() => {
              controller.getGraph().reset();
              controller.getGraph().layout();
            }),
            legend: false,
          })}
        />
      }
    >
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
};

export default PipelineVisualizationSurface;
