import React from 'react';
import '@patternfly/patternfly/patternfly.min.css';
import '@patternfly/patternfly/patternfly-addons.css';
import {
  Page,
  PageSection,
  EmptyState,
  EmptyStateBody,
  Bullseye,
  Spinner,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import Header from './Header';
import NavSidebar from './NavSidebar';
import { useUser } from './useUser';

const Shell: React.FC = () => {
  const { user, loading, error } = useUser();

  if (loading) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <Page
      className="app-shell"
      isManagedSidebar
      isContentFilled
      masthead={<Header username={user ?? 'unknown'} />}
      sidebar={<NavSidebar />}
      mainContainerId="app-shell-main"
    >
      <PageSection hasBodyWrapper={false}>
        <EmptyState headingLevel="h1" titleText="No features loaded" icon={CubesIcon}>
          <EmptyStateBody>
            The app shell is running with zero plugins.
            {error && (
              <>
                <br />
                <small>BFF status: {error}</small>
              </>
            )}
          </EmptyStateBody>
        </EmptyState>
      </PageSection>
    </Page>
  );
};

export default Shell;
