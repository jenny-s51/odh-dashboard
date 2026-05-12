import React from 'react';
import { PageSection, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Routes, Route, Navigate } from 'react-router-dom';
import Shell from '@odh-dashboard/base-distribution/Shell';
import { useUser } from '@odh-dashboard/base-distribution/useUser';
import Header from './Header';
import NavSidebar from './NavSidebar';
import ModelsPage from './pages/ModelsPage';

const HomePage: React.FC = () => (
  <PageSection hasBodyWrapper={false}>
    <EmptyState headingLevel="h1" titleText="Home" icon={CubesIcon}>
      <EmptyStateBody>
        Welcome to the Red Hat AI Inference UI. Select a feature from the sidebar.
      </EmptyStateBody>
    </EmptyState>
  </PageSection>
);

const RhaiShell: React.FC = () => {
  const { user, error } = useUser();

  return (
    <Shell masthead={<Header username={user ?? 'unknown'} />} sidebar={<NavSidebar />}>
      {error && <small>BFF status: {error}</small>}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai-hub/models/*" element={<ModelsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
};

export default RhaiShell;
