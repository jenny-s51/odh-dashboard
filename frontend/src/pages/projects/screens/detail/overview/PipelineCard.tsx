import * as React from 'react';
import { CodeBranchIcon } from '@patternfly/react-icons';
import { CreatePipelineServerButton } from '~/concepts/pipelines/context';
import usePipelines from '~/concepts/pipelines/apiHooks/usePipelines';
import { LIMIT_MAX_ITEM_COUNT } from '~/concepts/pipelines/const';
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
      icon={() => <CodeBranchIcon style={{ height: '32px' }} alt="Pipelines" />}
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
