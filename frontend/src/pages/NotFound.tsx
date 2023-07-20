import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  PageSection,
  PageSectionVariants, EmptyStateHeader, EmptyStateFooter,
} from '@patternfly/react-core';
import { HomeIcon, PathMissingIcon } from '@patternfly/react-icons';

const NotFound: React.FC = () => (
  <PageSection variant={PageSectionVariants.light}>
    <EmptyState variant={EmptyStateVariant.full}>
      <EmptyStateHeader titleText="We can‘t find that page" icon={<EmptyStateIcon icon={PathMissingIcon} />} headingLevel="h2" />
      <EmptyStateBody>
        Another page might have what you need. Return to the home page.
      </EmptyStateBody><EmptyStateFooter>
      <Button component="a" href="/" variant="primary">
        <HomeIcon /> Home
      </Button>
    </EmptyStateFooter></EmptyState>
  </PageSection>
);

export default NotFound;
