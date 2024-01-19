import * as React from 'react';
import {
  Button,
  Divider,
  Flex,
  FlexItem,
  Icon,
  PageSection,
  Popover,
} from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';
import EmptyDetailsList from '~/pages/projects/screens/detail/EmptyDetailsList';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import DetailsSection from '~/pages/projects/screens/detail/DetailsSection';
import { ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { FAST_POLL_INTERVAL } from '~/utilities/const';
import NotebookTable from './NotebookTable';
import { HelpIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';


import DashboardPopupIconButton from '~/concepts/dashboard/DashboardPopupIconButton';

const NotebookList: React.FC = () => {
  const {
    currentProject,
    notebooks: { data: notebookStates, loaded, error: loadError, refresh: refreshNotebooks },
    refreshAllProjectData: refresh,
  } = React.useContext(ProjectDetailsContext);
  const navigate = useNavigate();
  const projectName = currentProject.metadata.name;
  const isNotebooksEmpty = notebookStates.length === 0;
  let icon;

  icon = (
    <img
      style={{
        marginLeft: 'var(--pf-v5-global--spacer--xs)',
        marginRight: 'var(--pf-v5-global--spacer--xs)',
        verticalAlign: 'middle',
      }}
      src="../images/UI_icon-Red_Hat-Wrench-RGB.svg"
      alt="Notebooks icon"
    />
  );

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (notebookStates.some((notebookState) => notebookState.isStarting)) {
      interval = setInterval(() => refreshNotebooks(), FAST_POLL_INTERVAL);
    }
    return () => clearInterval(interval);
  }, [notebookStates, refreshNotebooks]);

  return (
    <>
      <DetailsSection
        icon={icon}
        id={ProjectSectionID.WORKBENCHES}
        title={ProjectSectionTitles[ProjectSectionID.WORKBENCHES] || ''}
        popover={
          <Popover
            headerContent={'About workbenches'}
            bodyContent={
              'Creating a workbench allows you to add a Jupyter notebook to your project.'
            }
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
        actions={[
          !isNotebooksEmpty && (
            <Button
              key={`action-${ProjectSectionID.WORKBENCHES}`}
              onClick={() => navigate(`/projects/${projectName}/spawner`)}
              variant="primary"
            >
              Create workbench
            </Button>
          ),
        ]}
        isLoading={!loaded}
        loadError={loadError}
        isEmpty={isNotebooksEmpty}
        emptyState={
          <Flex>
            <FlexItem>
              <EmptyDetailsList
                description="Creating a workbench allows you to add a Jupyter notebook to your project."
                actions={[
                  <Button
                    key={`action-${ProjectSectionID.WORKBENCHES}`}
                    onClick={() => navigate(`/projects/${projectName}/spawner`)}
                    variant="secondary"
                    size="lg"
                  >
                    Create workbench
                  </Button>,
                ]}
              />
            </FlexItem>
          </Flex>
        }
      >
        <NotebookTable notebookStates={notebookStates} refresh={refresh} />
      </DetailsSection>
    </>
  );
};

export default NotebookList;
