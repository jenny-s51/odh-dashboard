import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  Tab,
  TabContent,
  Tabs,
  TabTitleText,
  Truncate,
} from '@patternfly/react-core';
import ApplicationsPage from '~/pages/ApplicationsPage';
import usePipelineTemplate from '~/concepts/pipelines/apiHooks/usePipelineTemplate';
import { usePipelineTaskTopology } from '~/concepts/pipelines/topology';
import usePipelineById from '~/concepts/pipelines/apiHooks/usePipelineById';
import MarkdownView from '~/components/MarkdownView';
import PipelineDetailsYAML from '~/concepts/pipelines/content/pipelinesDetails/PipelineDetailsYAML';
import { usePipelinesAPI } from '~/concepts/pipelines/context';
import { PipelineCoreDetailsPageComponent } from '~/concepts/pipelines/content/types';
import DeletePipelineCoreResourceModal from '~/concepts/pipelines/content/DeletePipelineCoreResourceModal';
import { PipelineTopology, PipelineTopologyEmpty } from '~/concepts/topology';
import PipelineDetailsActions from "~/concepts/pipelines/content/pipelinesDetails/pipeline/PipelineDetailsActions";
import PipelineNotFound from "~/concepts/pipelines/content/pipelinesDetails/pipeline/PipelineNotFound";
import SelectedTaskDrawerContent from "~/concepts/pipelines/content/pipelinesDetails/pipeline/SelectedTaskDrawerContent";
import { useDemoPipelineNodes } from "~/concepts/topology/useDemoPipelineNodes";
import { usePipelineOptions } from "~/concepts/topology/usePipelineOptions";
import { PipelineLayout } from "~/concepts/topology/PipelineLayout";
import { TopologyPipelinesGettingStartedDemo } from "~/concepts/topology/GettingStartedDemo";
import { DEFAULT_FINALLY_NODE_TYPE } from "@patternfly/react-topology";
import { TopologyPackage } from "~/concepts/topology/TopologyPackage";
import '~/concepts/topology/topology.css';

enum PipelineDetailsTab {
  GRAPH,
  YAML,
}
type TodoPreview = Omit<PipelineCoreDetailsPageComponent, "breadcrumbPath">;

const PipelineDetails = () => {
  const { pipelineId } = useParams();
  const navigate = useNavigate();
  const { namespace } = usePipelinesAPI();
  const [pipeline, pipelineLoad, pipelineLoadError] = usePipelineById(pipelineId);
  const [isDeleting, setDeleting] = React.useState(false);
  const [pipelineRun, pipelineTemplateLoaded, templateLoadError] = usePipelineTemplate(pipelineId);
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(PipelineDetailsTab.GRAPH);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const { taskMap, nodes } = usePipelineTaskTopology(pipelineRun);

  const { showBadges, showIcons, showGroups, badgeTooltips } = usePipelineOptions(
    true
  );
  // const pipelineNodes = useDemoPipelineNodes(
  //   showBadges,
  //   showIcons,
  //   badgeTooltips,
  //   'DagreLayout',
  //   showGroups
  // );

  if (pipelineLoadError) {
    return (
      <ApplicationsPage
        title="Topology sandbox"
        empty={false}
        loaded={!pipelineLoad}
      >
        <PipelineNotFound />
      </ApplicationsPage>
    );
  }
  return (
    <>
      <Drawer isExpanded>
        <DrawerContent
          panelContent={
            <SelectedTaskDrawerContent
              task={selectedId ? taskMap[selectedId] : undefined}
              onClose={() => setSelectedId(null)}
            />
          }
        >
          <DrawerContentBody style={{ display: 'flex', flexDirection: 'column' }}>
            <ApplicationsPage
              title={<Truncate content={"Topology v2 sandbox"} />}
              description={
                pipeline ? <MarkdownView conciseDisplay markdown={pipeline.description} /> : ''
              }
              empty={false}
              loaded
              // loaded={pipelineLoad && pipelineTemplateLoaded}
              loadError={templateLoadError}
              headerAction={
                pipelineLoad &&
                pipelineTemplateLoaded && (
                  <PipelineDetailsActions onDelete={() => setDeleting(true)} pipeline={pipeline} />
                )
              }
            >
              <Tabs
                style={{ flexShrink: 0 }}
                activeKey={activeTabKey}
                onSelect={(e, tabIndex) => {
                  setActiveTabKey(tabIndex);
                  setSelectedId(null);
                }}
                aria-label="Pipeline Details tabs"
                role="region"
              >
                <Tab
                  eventKey={PipelineDetailsTab.GRAPH}
                  title={<TabTitleText>Graph</TabTitleText>}
                  aria-label="Pipeline Graph Tab"
                  tabContentId={`tabContent-${PipelineDetailsTab.GRAPH}`}
                />

                {/* <Tab
                  eventKey={PipelineDetailsTab.YAML}
                  title={<TabTitleText>YAML</TabTitleText>}
                  aria-label="Pipeline YAML Tab"
                  tabContentId={`tabContent-${PipelineDetailsTab.YAML}`}
                /> */}
              </Tabs>
              <div style={{ flexGrow: 1 }}>
                <TabContent
                  id={`tabContent-${PipelineDetailsTab.GRAPH}`}
                  eventKey={PipelineDetailsTab.GRAPH}
                  activeKey={activeTabKey}
                  hidden={PipelineDetailsTab.GRAPH !== activeTabKey}
                  style={{ height: '100%' }}
                >
                    <PipelineLayout />
                    {/* <TopologyPackage /> */}


                </TabContent>
                {/* <TabContent
                  id={`tabContent-${PipelineDetailsTab.YAML}`}
                  eventKey={PipelineDetailsTab.YAML}
                  activeKey={activeTabKey}
                  hidden={PipelineDetailsTab.YAML !== activeTabKey}
                  style={{ height: '100%' }}
                >
                  <PipelineDetailsYAML
                    filename={`Pipeline ${pipelineRun?.metadata.name}`}
                    content={pipelineRun}
                  />
                </TabContent> */}
              </div>
            </ApplicationsPage>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PipelineDetails;
