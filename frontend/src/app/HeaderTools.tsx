import React from 'react';
import {
  NotificationBadge,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Button,
  Tooltip,
  MenuToggle,
  MenuToggleElement,
  Dropdown,
  DropdownItem,
  DropdownList,
} from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import { COMMUNITY_LINK, DOC_LINK, SUPPORT_LINK, DEV_MODE } from '~/utilities/const';
import useNotification from '~/utilities/useNotification';
import { updateImpersonateSettings } from '~/services/impersonateService';
import { AppNotification } from '~/redux/types';
import { useAppSelector } from '~/redux/hooks';
import AppLauncher from './AppLauncher';
import { useAppContext } from './AppContext';
import { logout } from './appUtils';

interface HeaderToolsProps {
  onNotificationsClick: () => void;
}

const HeaderTools: React.FC<HeaderToolsProps> = ({ onNotificationsClick }) => {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = React.useState(false);
  const notifications: AppNotification[] = useAppSelector((state) => state.notifications);
  const userName: string = useAppSelector((state) => state.user || '');
  const isImpersonating: boolean = useAppSelector((state) => state.isImpersonating || false);
  const { dashboardConfig } = useAppContext();
  const notification = useNotification();

  const newNotifications = React.useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout().then(() => {
      /* eslint-disable-next-line no-console */
      console.log('logged out');
      window.location.reload();
    });
  };

  const userMenuItems = [
    <DropdownItem key="logout" onClick={handleLogout}>
      Log out
    </DropdownItem>,
  ];

  if (DEV_MODE && !isImpersonating) {
    userMenuItems.unshift(
      <DropdownItem
        key="impersonate"
        onClick={() => {
          updateImpersonateSettings(true)
            .then(() => location.reload())
            .catch((e) => notification.error('Failed impersonating user', e.message));
        }}
      >
        Start impersonate
      </DropdownItem>,
    );
  }

  const handleHelpClick = () => {
    setHelpMenuOpen(false);
  };

  const helpMenuItems: React.ReactElement[] = [];
  if (DOC_LINK) {
    helpMenuItems.push(
      <DropdownItem
        key="documentation"
        isExternalLink
        onClick={handleHelpClick}
        to={DOC_LINK}
        target="_blank"
        rel="noopener noreferrer"
      >
        Documentation
      </DropdownItem>,
    );
  }
  if (SUPPORT_LINK && !dashboardConfig.spec.dashboardConfig.disableSupport) {
    helpMenuItems.push(
      <DropdownItem
        key="support"
        isExternalLink
        onClick={handleHelpClick}
        to={SUPPORT_LINK}
        target="_blank"
        rel="noopener noreferrer"
      >
        Support
      </DropdownItem>,
    );
  }
  if (COMMUNITY_LINK) {
    helpMenuItems.push(
      <DropdownItem
        key="community"
        isExternalLink
        onClick={handleHelpClick}
        to={COMMUNITY_LINK}
        target="_blank"
        rel="noopener noreferrer"
      >
        Community
      </DropdownItem>,
    );
  }

  return (
    <Toolbar isFullHeight>
      <ToolbarContent>
        <ToolbarGroup variant="icon-button-group" align={{ default: 'alignRight' }}>
          {!dashboardConfig.spec.dashboardConfig.disableAppLauncher ? (
            <ToolbarItem>
              <AppLauncher />
            </ToolbarItem>
          ) : null}
          <ToolbarItem>
            <NotificationBadge
              aria-label="Notification drawer"
              variant="read"
              count={newNotifications}
              onClick={onNotificationsClick}
            />
          </ToolbarItem>
          {helpMenuItems.length > 0 ? (
            <ToolbarItem>
              <Dropdown
                toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                  <MenuToggle
                    aria-label="Help items"
                    id="help-icon-toggle"
                    ref={toggleRef}
                    variant="plain"
                    onClick={() => setHelpMenuOpen(!helpMenuOpen)}
                    isExpanded={helpMenuOpen}
                  >
                    <QuestionCircleIcon />
                  </MenuToggle>
                )}
                isOpen={helpMenuOpen}
                onOpenChange={(isOpen: boolean) => setHelpMenuOpen(isOpen)}
                shouldFocusToggleOnSelect
              >
                <DropdownList>{helpMenuItems}</DropdownList>
              </Dropdown>
            </ToolbarItem>
          ) : null}
        </ToolbarGroup>
        {DEV_MODE && isImpersonating && (
          <ToolbarItem>
            <Tooltip
              content={`You are impersonating as ${userName}, click to stop impersonating`}
              position="bottom"
            >
              <Button
                onClick={() =>
                  updateImpersonateSettings(false)
                    .then(() => location.reload())
                    .catch((e) => notification.error('Failed stopping impersonating', e.message))
                }
              >
                Stop impersonate
              </Button>
            </Tooltip>
          </ToolbarItem>
        )}
        <ToolbarItem>
          <Dropdown
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                id="user-menu-toggle"
                ref={toggleRef}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                isExpanded={userMenuOpen}
              >
                {userName}
              </MenuToggle>
            )}
            isOpen={userMenuOpen}
            onOpenChange={(isOpen: boolean) => setUserMenuOpen(isOpen)}
            shouldFocusToggleOnSelect
          >
            {' '}
            <DropdownList>{userMenuItems}</DropdownList>
          </Dropdown>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

export default HeaderTools;
