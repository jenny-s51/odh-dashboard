import * as React from 'react';
import { CreatePipelineServerButton } from '~/concepts/pipelines/context';
import usePipelines from '~/concepts/pipelines/apiHooks/usePipelines';
import { LIMIT_MAX_ITEM_COUNT } from '~/concepts/pipelines/const';
import emptyStateImg from '~/images/UI_icon-Red_Hat-Branch-RGB.svg';
import OverviewCard from './OverviewCard';

type PipelineCardProps = {
  allowCreate: boolean;
};
const PipelineCard: React.FC<PipelineCardProps> = ({ allowCreate }) => {
  const [pipelines, loaded, loadError] = usePipelines(LIMIT_MAX_ITEM_COUNT);
  return (
    <OverviewCard
      loading={!loaded}
      loadError={loadError}
      count={pipelines.length}
      title="Pipelines"
      description="Further enhance and deploy your models."
      imgSrc={emptyStateImg}
      imgAlt="Pipelines"
      allowCreate={allowCreate}
      actionButton={
        allowCreate ? (
          <CreatePipelineServerButton
            variant="link"
            size="sm"
            title={pipelines.length ? 'Import pipeline' : 'Get started'}
          />
        ) : null
      }
      typeModifier="pipeline"
      navSection="pipelines"
    />
  );
};

export default PipelineCard;
