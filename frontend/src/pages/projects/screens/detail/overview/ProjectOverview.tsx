import * as React from 'react';
import { Label, PageSection, Spinner } from '@patternfly/react-core';
import { ChartDonut } from '@patternfly/react-charts';
import emptyStateImg from '~/images/empty-state-projects-overview.svg';
import projectBackgroundImage from '~/images/project-overview-background-img.svg';
import projectIcon from '~/images/project-icon.svg';
import EmptyDetailsList from '~/pages/projects/screens/detail/EmptyDetailsList';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { useAccessReview } from '~/api';
import { AccessReviewResource } from '~/pages/projects/screens/detail/const';
import NotebookCard from '~/pages/projects/screens/detail/overview/NotebookCard';
import ClusterStorageCard from '~/pages/projects/screens/detail/overview/ClusterStorageCard';
import usePipelines from '~/concepts/pipelines/apiHooks/usePipelines';
import { LIMIT_MAX_ITEM_COUNT } from '~/concepts/pipelines/const';
import PipelineCard from '~/pages/projects/screens/detail/overview/PipelineCard';
import ModelServerCard from '~/pages/projects/screens/detail/overview/ModelServerCard';
import DataConnectionCard from '~/pages/projects/screens/detail/overview/DataConnectionCard';
import UserGroupsCard from '~/pages/projects/screens/detail/overview/UserGroupsCard';
import { ServingRuntimePlatform } from '~/types';
import { getProjectModelServingPlatform } from '~/pages/modelServing/screens/projects/utils';
import useServingPlatformStatuses from '~/pages/modelServing/useServingPlatformStatuses';

import './ProjectOverview.scss';

const WorkbenchesColor = '#C9190B';
const ClusterStorageColor = '#EC7A08';
const DataConnectionsColor = '#F4C145';
const PipelinesColor = '#5752D1';
const ModelServersColor = '#009596';

const ProjectOverview: React.FC = () => {
  const {
    currentProject,
    notebooks: { data: notebookStates, loaded: notebooksLoaded },
    pvcs: { data: pvcs, loaded: pvcsLoaded },
    servingRuntimes: { data: modelServers, loaded: modelServersLoaded },
    dataConnections: { data: dataConnections, loaded: dataConnectionsLoaded },
  } = React.useContext(ProjectDetailsContext);
  const [allowCreate, rbacLoaded] = useAccessReview({
    ...AccessReviewResource,
    namespace: currentProject.metadata.name,
  });
  const [pipelines, pipelinesLoaded] = usePipelines(LIMIT_MAX_ITEM_COUNT);
  const servingPlatformStatuses = useServingPlatformStatuses();
  const { platform: currentProjectServingPlatform } = getProjectModelServingPlatform(
    currentProject,
    servingPlatformStatuses,
  );
  const isProjectModelMesh = currentProjectServingPlatform === ServingRuntimePlatform.MULTI;

  const isEmptyProject =
    notebookStates.length === 0 &&
    pvcs.length === 0 &&
    pipelines.length === 0 &&
    dataConnections.length === 0 &&
    modelServers.length === 0;

  const loading =
    !notebooksLoaded ||
    !pipelinesLoaded ||
    !pvcsLoaded ||
    !modelServersLoaded ||
    !dataConnectionsLoaded;

  const projectContent = () => {
    if (loading) {
      return (
        <div className="odh-project-overview__project m-is-empty">
          <EmptyDetailsList title="Loading..." icon={() => <Spinner />} />
        </div>
      );
    }
    if (isEmptyProject) {
      return (
        <div className="odh-project-overview__project m-is-empty">
          <EmptyDetailsList
            title="Start by building out your project"
            description="From workbenches to model servers, your data science project can be organized and customized to meet your needs."
            icon={() => <img style={{ height: '320px' }} src={emptyStateImg} alt="Workbenches" />}
          />
        </div>
      );
    }
    return (
      <div className="odh-project-overview__project">
        <div className="odh-project-overview__project-info">
          <div style={{ height: '375px', width: '100%', marginTop: '135px' }}>
            <ChartDonut
              ariaDesc="Project breakdown"
              ariaTitle="Project breakdown"
              constrainToVisibleArea
              data={[
                { x: 'Workbenches', y: notebookStates.length, fill: WorkbenchesColor },
                { x: 'Cluster storage', y: pvcs.length, fill: ClusterStorageColor },
                { x: 'Data connections', y: dataConnections.length, fill: DataConnectionsColor },
                { x: 'Pipelines', y: pipelines.length, fill: PipelinesColor },
                { x: 'Model servers', y: modelServers.length, fill: ModelServersColor },
              ]}
              height={275}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              name="project-components"
              padding={{ bottom: 20, left: 25, right: 25, top: 20 }}
              style={{ data: { fill: ({ datum }) => datum.fill } }}
              width={380}
            />
            <div className="odh-project-overview__chart-inner">
              <img src={projectIcon} alt="project" />
              <div className="odh-project-overview__chart-title">Project breakdown</div>
              <Label key="serving-platform-label">
                {isProjectModelMesh
                  ? 'Multi-model serving enabled'
                  : 'Single-model serving enabled'}
              </Label>
            </div>
            <div className="odh-project-overview__legend">
              <div className="odh-project-overview__legend-item">
                <div
                  className="odh-project-overview__legend-item--color"
                  style={{ background: WorkbenchesColor }}
                />
                Workbenches
              </div>
              <div className="odh-project-overview__legend-item">
                <div
                  className="odh-project-overview__legend-item--color"
                  style={{ background: ClusterStorageColor }}
                />
                Cluster storage
              </div>
              <div className="odh-project-overview__legend-item">
                <div
                  className="odh-project-overview__legend-item--color"
                  style={{ background: DataConnectionsColor }}
                />
                Data connections
              </div>
              <div className="odh-project-overview__legend-item">
                <div
                  className="odh-project-overview__legend-item--color"
                  style={{ background: PipelinesColor }}
                />
                Pipelines
              </div>
              <div className="odh-project-overview__legend-item">
                <div
                  className="odh-project-overview__legend-item--color"
                  style={{ background: ModelServersColor }}
                />
                Model servers
              </div>
            </div>
          </div>
        </div>
        <img
          className="odh-project-overview__project-background"
          src={projectBackgroundImage}
          alt="project"
        />
      </div>
    );
  };

  return (
    <PageSection
      className="odh-project-overview"
      isFilled
      aria-label="project-details-page-section"
      variant="light"
    >
      {projectContent()}
      <div className="odh-project-overview__components">
        <NotebookCard allowCreate={rbacLoaded && allowCreate} />
        <PipelineCard allowCreate={rbacLoaded && allowCreate} />
        <ClusterStorageCard allowCreate={rbacLoaded && allowCreate} />
        <ModelServerCard />
        <DataConnectionCard allowCreate={rbacLoaded && allowCreate} />
        {isEmptyProject ? <UserGroupsCard users={0} groups={0} /> : null}
      </div>
    </PageSection>
  );
};

export default ProjectOverview;