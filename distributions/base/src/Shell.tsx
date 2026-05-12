import React from 'react';
import '@patternfly/patternfly/patternfly.min.css';
import '@patternfly/patternfly/patternfly-addons.css';
import { Page, Bullseye, Spinner } from '@patternfly/react-core';
import { useUser } from './useUser';

type ShellProps = {
  masthead: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

const Shell: React.FC<ShellProps> = ({ masthead, sidebar, children }) => {
  const { loading } = useUser();

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
      masthead={masthead}
      sidebar={sidebar}
      mainContainerId="app-shell-main"
    >
      {children}
    </Page>
  );
};

export default Shell;
