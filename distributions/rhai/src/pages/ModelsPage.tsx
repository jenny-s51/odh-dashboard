import React from 'react';
import { EmptyState, EmptyStateBody, PageSection, Tab, Tabs, Title } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

const TAB_KEYS = ['deployments'] as const;
type TabKey = (typeof TAB_KEYS)[number];

const DeploymentsTab: React.FC = () => (
  <EmptyState headingLevel="h2" titleText="Deployments" icon={CubesIcon}>
    <EmptyStateBody>Model serving deployments will appear here.</EmptyStateBody>
  </EmptyState>
);

const ModelsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab: TabKey = location.pathname.includes('/deployments')
    ? 'deployments'
    : 'deployments';

  return (
    <>
      <PageSection hasBodyWrapper={false}>
        <Title headingLevel="h1">Models</Title>
      </PageSection>
      <PageSection hasBodyWrapper={false} type="tabs">
        <Tabs
          activeKey={activeTab}
          onSelect={(_e, key) => navigate(`/ai-hub/models/${String(key)}`)}
        >
          <Tab eventKey="deployments" title="Deployments" />
        </Tabs>
      </PageSection>
      <PageSection hasBodyWrapper={false}>
        <Routes>
          <Route path="deployments" element={<DeploymentsTab />} />
          <Route path="*" element={<Navigate to="deployments" replace />} />
        </Routes>
      </PageSection>
    </>
  );
};

export default ModelsPage;
