import React from 'react';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  PageSection,
  PageSectionVariants,
  EmptyStateHeader,
} from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';

type UnauthorizedErrorProps = {
  variant?: PageSectionVariants;
  titleText: string;
  error: Error;
  testId?: string;
};
const UnknownError: React.FC<UnauthorizedErrorProps> = ({
  titleText,
  error,
  testId,
}) => (
  <PageSection isFilled variant={PageSectionVariants.default} data-testid={testId}>
    <EmptyState variant={EmptyStateVariant.lg}>
      <EmptyStateHeader
        titleText={titleText}
        icon={<EmptyStateIcon icon={ErrorCircleOIcon} />}
        headingLevel="h5"
      />
      <EmptyStateBody>{error.message}</EmptyStateBody>
    </EmptyState>
  </PageSection>
);

export default UnknownError;
