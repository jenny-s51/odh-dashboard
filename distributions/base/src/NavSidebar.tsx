import React from 'react';
import {
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  PageSidebar,
  PageSidebarBody,
} from '@patternfly/react-core';
import { useLocation, useNavigate } from 'react-router-dom';

const NavSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <PageSidebar>
      <PageSidebarBody>
        <Nav aria-label="App Shell Navigation">
          <NavList>
            <NavItem isActive={location.pathname === '/'} onClick={() => navigate('/')}>
              Home
            </NavItem>
            <NavExpandable
              title="AI hub"
              isActive={location.pathname.startsWith('/ai-hub')}
              isExpanded={location.pathname.startsWith('/ai-hub')}
            >
              <NavItem
                isActive={location.pathname.startsWith('/ai-hub/models')}
                onClick={() => navigate('/ai-hub/models/deployments')}
              >
                Models
              </NavItem>
            </NavExpandable>
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
};

export default NavSidebar;
