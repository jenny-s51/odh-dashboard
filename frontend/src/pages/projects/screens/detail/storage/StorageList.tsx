import * as React from 'react';
import { Button, Flex, FlexItem, Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import EmptyDetailsList from '~/pages/projects/screens/detail/EmptyDetailsList';
import DetailsSection from '~/pages/projects/screens/detail/DetailsSection';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import DashboardPopupIconButton from '~/concepts/dashboard/DashboardPopupIconButton';
import ManageStorageModal from './ManageStorageModal';
import StorageTable from './StorageTable';

const StorageList: React.FC = () => {
  const [isOpen, setOpen] = React.useState(false);
  const {
    pvcs: { data: pvcs, loaded, error: loadError },
    refreshAllProjectData: refresh,
  } = React.useContext(ProjectDetailsContext);

  const isPvcsEmpty = pvcs.length === 0;

  const icon = (
    <img
      style={{
        marginLeft: 'var(--pf-v5-global--spacer--xs)',
        marginRight: 'var(--pf-v5-global--spacer--xs)',
        verticalAlign: 'middle',
      }}
      src="../images/UI_icon-Red_Hat-Storage-RGB.svg"
      alt="Storage icon"
    />
  );

  return (
    <>
      <DetailsSection
        icon={icon}
        id={ProjectSectionID.CLUSTER_STORAGES}
        title={ProjectSectionTitles[ProjectSectionID.CLUSTER_STORAGES] || ''}
        popover={
          <Popover
            headerContent="About cluster storage"
            bodyContent="For data science projects that require data to be retained, you can add cluster storage to the project."
          >
            <DashboardPopupIconButton
              icon={
                <OutlinedQuestionCircleIcon
                  style={{ marginLeft: 'var(--pf-v5-global--spacer--md)' }}
                />
              }
              aria-label="More info"
            />
          </Popover>
        }
        actions={
          !isPvcsEmpty
            ? [
                <Button
                  onClick={() => setOpen(true)}
                  key={`action-${ProjectSectionID.CLUSTER_STORAGES}`}
                  variant="primary"
                >
                  Add cluster storage
                </Button>,
              ]
            : undefined
        }
        isLoading={!loaded}
        isEmpty={isPvcsEmpty}
        loadError={loadError}
        emptyState={
          <Flex>
            <FlexItem>
              <EmptyDetailsList
                actions={[
                  <Button
                    onClick={() => setOpen(true)}
                    key={`action-${ProjectSectionID.CLUSTER_STORAGES}`}
                    variant="secondary"
                    size="lg"
                  >
                    Add cluster storage
                  </Button>,
                ]}
                description="For data science projects that require data to be retained, you can add cluster storage to the project"
              />
            </FlexItem>
          </Flex>
        }
      >
        <StorageTable pvcs={pvcs} refresh={refresh} onAddPVC={() => setOpen(true)} />
      </DetailsSection>
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

export default StorageList;
