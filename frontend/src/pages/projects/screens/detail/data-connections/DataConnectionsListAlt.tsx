import * as React from 'react';
import { Button } from '@patternfly/react-core';
import EmptyDetailsList from '~/pages/projects/screens/detail/EmptyDetailsList';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { AccessReviewResource, ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { useAccessReview } from '~/api';
import emptyStateImg from '~/images/empty-state-data-connections.svg';
import DetailsSectionAlt from '~/pages/projects/screens/detail/DetailsSectionAlt';
import ManageDataConnectionModal from './ManageDataConnectionModal';
import DataConnectionsTable from './DataConnectionsTable';

const DataConnectionsListAlt: React.FC = () => {
  const {
    currentProject,
    dataConnections: { data: connections, loaded, error },
    refreshAllProjectData,
  } = React.useContext(ProjectDetailsContext);
  const [allowCreate, rbacLoaded] = useAccessReview({
    ...AccessReviewResource,
    namespace: currentProject.metadata.name,
  });
  const [open, setOpen] = React.useState(false);

  const isDataConnectionsEmpty = connections.length === 0;

  return (
    <>
      <DetailsSectionAlt
        id={ProjectSectionID.DATA_CONNECTIONS}
        title={ProjectSectionTitles[ProjectSectionID.DATA_CONNECTIONS] || ''}
        actions={[
          <Button
            key={`action-${ProjectSectionID.DATA_CONNECTIONS}`}
            variant="secondary"
            onClick={() => setOpen(true)}
          >
            Add data connection
          </Button>,
        ]}
        isLoading={!loaded}
        isEmpty={isDataConnectionsEmpty}
        loadError={error}
        emptyState={
          <EmptyDetailsList
            title="Start by adding a data connection"
            description="Adding a data connection to your project allows you toconnect data inputs to your workbenches."
            icon={() => <img style={{ height: '320px' }} src={emptyStateImg} alt="Workbenches" />}
            actions={
              rbacLoaded && allowCreate ? (
                <Button
                  key={`action-${ProjectSectionID.DATA_CONNECTIONS}`}
                  onClick={() => setOpen(true)}
                  variant="primary"
                >
                  Add data connection
                </Button>
              ) : null
            }
          />
        }
      >
        {isDataConnectionsEmpty ? (
          <DataConnectionsTable connections={connections} refreshData={refreshAllProjectData} />
        ) : null}
      </DetailsSectionAlt>
      <ManageDataConnectionModal
        isOpen={open}
        onClose={(submitted) => {
          if (submitted) {
            refreshAllProjectData();
          }
          setOpen(false);
        }}
      />
    </>
  );
};

export default DataConnectionsListAlt;
