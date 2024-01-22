import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import emptyStateImg from '~/images/UI_icon-Red_Hat-Server-RGB.svg';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import OverviewCard from './OverviewCard';

const ModelServerCard: React.FC = () => {
  const navigate = useNavigate();
  const {
    servingRuntimes: { data: modelServers, loaded, error },
    currentProject,
  } = React.useContext(ProjectDetailsContext);

  return (
    <OverviewCard
      loading={!loaded}
      loadError={error}
      count={modelServers.length}
      title="Model servers"
      description="Allow apps to send requests to your models."
      icon={() => <img style={{ height: '32px' }} src={emptyStateImg} alt="Model Servers" />}
      allowCreate
      onAction={() => navigate(`/projects/${currentProject.metadata.name}?section=model-servers`)}
      typeModifier="model-server"
      navSection="model-servers"
    />
  );
};

export default ModelServerCard;
