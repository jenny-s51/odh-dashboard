import * as React from 'react';
import {
  EmptyState,
  EmptyStateHeader,
  EmptyStateFooter,
  EmptyStateBody,
} from '@patternfly/react-core';
import { CreatePipelineServerButton } from '~/concepts/pipelines/context';
import { useAppSelector } from '~/redux/hooks';
import EmptyDetailsView from '~/pages/projects/screens/detail/EmptyDetailsView';
import emptyStateImg from '~/images/empty-state-pipelines.svg';

type NoPipelineServerProps = {
  variant: React.ComponentProps<typeof CreatePipelineServerButton>['variant'];
};

const NoPipelineServer: React.FC<NoPipelineServerProps> = ({ variant }) => {
  const alternateUI = useAppSelector((state) => state.alternateUI);
  if (alternateUI) {
    return (
      <EmptyDetailsView
        title="Start by creating a pipeline"
        description="Standardize and automate machine learning workflows to enable you to further enhance and deploy your data science models."
        iconImage={emptyStateImg}
        allowCreate={true}
        createButton={<CreatePipelineServerButton variant={variant} />}
      />
    );
  }
  return (
    <EmptyState
      style={{
        border: 'dashed',
        borderColor: 'var(--pf-v5-global--Color--400)',
        borderWidth: '1.5px',
        marginBottom: 'var(--pf-v5-global--spacer--xl)',
      }}
      variant="xs"
    >
      <EmptyStateHeader titleText="Start by creating a pipeline" headingLevel="h3" />
      <EmptyStateBody>
        Standardize and automate machine learning workflows to enable you to further enhance and
        deploy your data science models.
      </EmptyStateBody>
      <EmptyStateFooter>
        <CreatePipelineServerButton variant={variant} />
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default NoPipelineServer;
