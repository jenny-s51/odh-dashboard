import React from 'react';
import {
  Masthead,
  MastheadLogo,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  MastheadBrand,
  PageToggleButton,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  MenuToggle,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';
import { MoonIcon, SunIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { useThemeContext } from './ThemeContext';

const PRODUCT_NAME = process.env.PRODUCT_NAME || 'RH AI Inference';

const BrandLink: React.FC<React.ComponentProps<typeof Link>> = (props) => (
  <Link {...props} to="/" />
);

type HeaderProps = {
  username: string;
};

const Header: React.FC<HeaderProps> = ({ username }) => {
  const { theme, setTheme } = useThemeContext();

  return (
    <Masthead role="banner" aria-label="page masthead">
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            id="page-nav-toggle"
            variant="plain"
            aria-label="Navigation"
            isHamburgerButton
          />
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo component={BrandLink}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{PRODUCT_NAME}</span>
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar isFullHeight>
          <ToolbarContent>
            <ToolbarGroup variant="action-group-plain" align={{ default: 'alignEnd' }}>
              <ToolbarItem>
                <ToggleGroup aria-label="Theme toggle">
                  <ToggleGroupItem
                    aria-label="light theme"
                    icon={<SunIcon />}
                    isSelected={theme === 'light'}
                    onChange={() => setTheme('light')}
                  />
                  <ToggleGroupItem
                    aria-label="dark theme"
                    icon={<MoonIcon />}
                    isSelected={theme === 'dark'}
                    onChange={() => setTheme('dark')}
                  />
                </ToggleGroup>
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarItem>
              <MenuToggle aria-label="User menu" id="user-menu-toggle" isDisabled>
                {username}
              </MenuToggle>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );
};

export default Header;
