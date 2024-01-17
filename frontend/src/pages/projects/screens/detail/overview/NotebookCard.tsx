import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';
import emptyStateImg from '~/images/UI_icon-Red_Hat-Wrench-RGB.svg';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import OverviewCard from './OverviewCard';

type NotebookCardProps = {
  allowCreate: boolean;
};

const NotebookCard: React.FC<NotebookCardProps> = ({ allowCreate }) => {
  const navigate = useNavigate();
  const {
    currentProject,
    notebooks: { data: notebooks, loaded, error },
  } = React.useContext(ProjectDetailsContext);

  return (
    <OverviewCard
      loading={!loaded}
      loadError={error}
      count={notebooks.length}
      title="Workbenches"
      description="Add a Jupyter notebook to your project."
      icon={() => <img style={{ height: '32px' }} src={emptyStateImg} alt="Workbenches" />}
      getStartedAction={
        allowCreate ? (
          <Button
            key={`action-${ProjectSectionID.WORKBENCHES}`}
            onClick={() => navigate(`/projects/${currentProject.metadata.name}/spawner`)}
            variant="link"
          >
            Get started
          </Button>
        ) : null
      }
      typeModifier="notebook"
      navSection="workbenches"
    />
  );
};

export default NotebookCard;
