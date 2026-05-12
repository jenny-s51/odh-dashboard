import React from 'react';
import { NavExpandable, NavItem } from '@patternfly/react-core';
import { useLocation, useNavigate } from 'react-router-dom';
import BaseNavSidebar from '@odh-dashboard/base-distribution/NavSidebar';

const NavSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <BaseNavSidebar>
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
    </BaseNavSidebar>
  );
};

export default NavSidebar;
