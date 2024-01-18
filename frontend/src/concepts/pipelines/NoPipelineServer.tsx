import * as React from 'react';
import {
  EmptyState,
  EmptyStateHeader,
  EmptyStateFooter,
  EmptyStateBody,
} from '@patternfly/react-core';
import { CreatePipelineServerButton } from '~/concepts/pipelines/context';

type NoPipelineServerProps = {
  variant: React.ComponentProps<typeof CreatePipelineServerButton>['variant'];
};

const NoPipelineServer: React.FC<NoPipelineServerProps> = ({ variant }) => (
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
      Standardize and automate machine learning workflows to enable you to further enchance and
      deploy your data science models.
    </EmptyStateBody>
    <EmptyStateFooter>
      <CreatePipelineServerButton variant={variant} />
    </EmptyStateFooter>
  </EmptyState>
);

export default NoPipelineServer;
