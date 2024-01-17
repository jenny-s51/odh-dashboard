import * as React from 'react';
import { Button } from '@patternfly/react-core';
import emptyStateImg from '~/images/UI_icon-Red_Hat-Storage-RGB.svg';
import ManageStorageModal from '~/pages/projects/screens/detail/storage/ManageStorageModal';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import OverviewCard from './OverviewCard';

type ClusterStorageCardProps = {
  allowCreate: boolean;
};

const ClusterStorageCard: React.FC<ClusterStorageCardProps> = ({ allowCreate }) => {
  const {
    pvcs: { data: pvcs, loaded, error, refresh },
  } = React.useContext(ProjectDetailsContext);
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <OverviewCard
        loading={!loaded}
        loadError={error}
        count={pvcs.length}
        title="Cluster storage"
        description="Save and retain data for your projects."
        icon={() => <img style={{ height: '32px' }} src={emptyStateImg} alt="Workbenches" />}
        getStartedAction={
          allowCreate ? (
            <Button
              key={`action-${ProjectSectionID.CLUSTER_STORAGES}`}
              onClick={() => setOpen(true)}
              variant="link"
            >
              Get started
            </Button>
          ) : null
        }
        typeModifier="cluster-storage"
        navSection="cluster-storage"
      />
      <ManageStorageModal
        isOpen={isOpen}
        onClose={(submit: boolean) => {
          setOpen(false);
          if (submit) {
            refresh();
          }
        }}
      />
    </>
  );
};

export default ClusterStorageCard;
