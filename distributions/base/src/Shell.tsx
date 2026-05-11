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
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import NavSidebar from './NavSidebar';
import ModelsPage from './pages/ModelsPage';
import { useUser } from './useUser';

const HomePage: React.FC = () => (
  <PageSection hasBodyWrapper={false}>
    <EmptyState headingLevel="h1" titleText="Home" icon={CubesIcon}>
      <EmptyStateBody>
        Welcome to the Red Hat AI Inference UI. Select a feature from the sidebar.
      </EmptyStateBody>
    </EmptyState>
  </PageSection>
);

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
      {error && <small>BFF status: {error}</small>}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai-hub/models/*" element={<ModelsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Page>
  );
};

export default Shell;
