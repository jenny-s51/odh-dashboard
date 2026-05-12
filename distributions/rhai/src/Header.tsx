import React from 'react';
import { MastheadLogo, MenuToggle, ToolbarItem } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import BaseHeader from '@odh-dashboard/base-distribution/Header';

const PRODUCT_NAME = process.env.PRODUCT_NAME || 'Red Hat AI Inference UI';

const BrandLink: React.FC<React.ComponentProps<typeof Link>> = (props) => (
  <Link {...props} to="/" />
);

type HeaderProps = {
  username: string;
};

const Header: React.FC<HeaderProps> = ({ username }) => (
  <BaseHeader
    brand={<MastheadLogo component={BrandLink}>{PRODUCT_NAME}</MastheadLogo>}
    toolbar={
      <ToolbarItem>
        <MenuToggle aria-label="User menu" id="user-menu-toggle" isDisabled>
          {username}
        </MenuToggle>
      </ToolbarItem>
    }
  />
);

export default Header;
