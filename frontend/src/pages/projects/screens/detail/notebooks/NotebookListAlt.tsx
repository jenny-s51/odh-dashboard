import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';
import EmptyDetailsList from '~/pages/projects/screens/detail/EmptyDetailsList';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { AccessReviewResource, ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { FAST_POLL_INTERVAL } from '~/utilities/const';
import { useAccessReview } from '~/api';
import emptyStateImg from '~/images/empty-state-notebooks.svg';
import DetailsSectionAlt from '~/pages/projects/screens/detail/DetailsSectionAlt';
import NotebookTable from './NotebookTable';

const NotebookListAlt: React.FC = () => {
  const {
    currentProject,
    notebooks: { data: notebookStates, loaded, error: loadError, refresh: refreshNotebooks },
    refreshAllProjectData: refresh,
  } = React.useContext(ProjectDetailsContext);
  const navigate = useNavigate();
  const projectName = currentProject.metadata.name;
  const isNotebooksEmpty = notebookStates.length === 0;
  const [allowCreate, rbacLoaded] = useAccessReview({
    ...AccessReviewResource,
    namespace: currentProject.metadata.name,
  });

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (notebookStates.some((notebookState) => notebookState.isStarting)) {
      interval = setInterval(() => refreshNotebooks(), FAST_POLL_INTERVAL);
    }
    return () => clearInterval(interval);
  }, [notebookStates, refreshNotebooks]);

  return (
    <>
      <DetailsSectionAlt
        id={ProjectSectionID.WORKBENCHES}
        title={ProjectSectionTitles[ProjectSectionID.WORKBENCHES] || ''}
        actions={[
          <Button
            key={`action-${ProjectSectionID.WORKBENCHES}`}
            onClick={() => navigate(`/projects/${projectName}/spawner`)}
            variant="secondary"
          >
            Create workbench
          </Button>,
        ]}
        isLoading={!loaded}
        loadError={loadError}
        isEmpty={isNotebooksEmpty}
        emptyState={
          <EmptyDetailsList
            title="Start by creating a workbench"
            description="Creating a workbench allows you to add a Jupyter notebook to your project."
            icon={() => <img style={{ height: '320px' }} src={emptyStateImg} alt="Workbenches" />}
            actions={
              rbacLoaded && allowCreate ? (
                <Button
                  key={`action-${ProjectSectionID.WORKBENCHES}`}
                  onClick={() => navigate(`/projects/${projectName}/spawner`)}
                  variant="primary"
                >
                  Create workbench
                </Button>
              ) : null
            }
          />
        }
      >
        {!isNotebooksEmpty ? (
          <NotebookTable notebookStates={notebookStates} refresh={refresh} />
        ) : null}
      </DetailsSectionAlt>
    </>
  );
};

export default NotebookListAlt;
