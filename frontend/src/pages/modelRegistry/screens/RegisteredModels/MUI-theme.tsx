// The import can be in any file that is included in your `tsconfig.json`
import type {} from '@mui/material/themeCssVarsAugmentation';
import { useTheme as muiUseTheme } from '@mui/material/styles';

const html = document.documentElement;

export const muiTheme = () => {
  const theme = muiUseTheme();
  // TODO: apply useTheme and access theme object
  const getTheme = () => {
    // console.log (theme);
    // console.log (theme.palette.action.active);

    console.log(theme);
    console.log('paddig block start should be 6', theme.unstable_sxConfig);
    console.log('paddig block start should be 6', theme.unstable_sxConfig.paddingBlockEnd);
    console.log('paddig inline start should be 16', theme.unstable_sxConfig.paddingInlineStart);
    console.log('paddig inline end ', theme?.unstable_sxConfig?.paddingInlineEnd)

    console.log('columnGap', theme.unstable_sxConfig.columnGap);
    return theme;
    // console.log (window.theme);
  };
  getTheme();

  const alerts = document.querySelectorAll('.pf-v6-c-alert');
  const alertIcons = document.querySelectorAll('.pf-v6-c-alert__icons');
  const alertTitles = document.querySelectorAll('.pf-v6-c-alert__title');
  const buttons = document.querySelectorAll('.pf-v6-c-button');
  const menus = document.querySelectorAll('.pf-v6-c-menu');
  const menuItems = document.querySelectorAll('.pf-v6-c-menu__item');
  const menuToggles = document.querySelectorAll('.pf-v6-c-menu__toggle');
  const tableButtons = document.querySelectorAll('.pf-v6-c-table__button');
  const tableCells = document.querySelectorAll('.pf-v6-c-table');
  const tableHeaders = document.querySelectorAll('.pf-v6-c-table__head');
  const tableRows = document.querySelectorAll('.pf-v6-c-table__tr');
  const tableSorts = document.querySelectorAll<HTMLElement>('.pf-v6-c-table__sort');
  const tableSortButtons = document.querySelectorAll<HTMLElement>('.pf-v6-c-table__sort__button');
  const tableSortIndicators = document.querySelectorAll<HTMLElement>(
    '.pf-v6-c-table__sort-indicator',
  );
  const tabContents = document.querySelectorAll('.pf-v6-c-tab-content__body');
  const tabsLinks = document.querySelectorAll('.pf-v6-c-tabs__link');
  const tabsItems = document.querySelectorAll('.pf-v6-c-tabs__item');
  const labels = document.querySelectorAll('.pf-v6-c-label');
  const paginationMenuToggles = document.querySelectorAll('.pf-v6-c-menu-toggle');

  // Global vars
  html.style.setProperty('--pf-t--color--blue--500', theme.palette.primary.main);
  html.style.setProperty('--pf-t--global--border--width--box--status--default', '1px');
  html.style.setProperty('--pf-t--global--border--radius--pill', `${theme.shape.borderRadius}`);
  html.style.setProperty('--pf-t--global--border--radius--medium', `${theme.shape.borderRadius}`);

  // Alert
  alerts.forEach((alert) => {
    // Check if the element is an instance of HTMLElement
    if (alert instanceof HTMLElement) {
      alert.style.setProperty(
        '--pf-v6-c-alert--m-warning__title--Color',
        '--pf-t--global--text--color--status--warning--default',
      );
      alert.style.setProperty('--pf-v6-c-alert--PaddingBlockStart', '6px');
      alert.style.setProperty('--pf-v6-c-alert--PaddingBlockEnd', '6px');
      alert.style.setProperty('--pf-v6-c-alert--PaddingInlineStart', '16px');
      alert.style.setProperty('--pf-v6-c-alert--PaddingInlineEnd', '16px');
      alert.style.setProperty('--pf-v6-c-alert--BoxShadow', 'none');
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  alertIcons.forEach((alertIcon) => {
    // Check if the element is an instance of HTMLElement
    if (alertIcon instanceof HTMLElement) {
      alertIcon.style.setProperty('--pf-v6-c-alert__icon--MarginInlineEnd', '12');
      alertIcon.style.setProperty('--pf-v6-c-alert__icon--MarginInlineEnd', '12px');
      alertIcon.style.setProperty('--pf-v6-c-alert__icon--MarginBlockStart', '7px');
      alertIcon.style.setProperty('--pf-v6-c-alert__icon--FontSize', '22px');
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  alertTitles.forEach((alertTitle) => {
    // Check if the element is an instance of HTMLElement
    if (alertTitle instanceof HTMLElement) {
      alertTitle.style.setProperty(
        '--pf-v6-c-alert__title--FontWeight',
        'var(--mui-alert-warning-font-weight)',
      );
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  // Button
  buttons.forEach((button) => {
    // Check if the element is an instance of HTMLElement
    if (button instanceof HTMLElement) {
      button.style.setProperty('--pf-v6-c-button--FontWeight', 'var(--mui-button-font-weight)');
      button.style.setProperty('--pf-v6-c-button--PaddingBlockStart', '6px');
      button.style.setProperty('--pf-v6-c-button--PaddingBlockEnd', '6px');
      button.style.setProperty('-pf-v6-c-button--PaddingInlineStart', '16px');
      button.style.setProperty('--pf-v6-c-button--PaddingInlineEnd', '16px');
      button.style.setProperty('pf-v6-c-button--LineHeight', '1.75');
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  // Menu
  menus.forEach((menu) => {
    // Check if the element is an instance of HTMLElement
    if (menu instanceof HTMLElement) {
      menu.style.setProperty('--pf-v6-c-menu--BoxShadow', theme.shadows[8]);
      menu.style.setProperty('--pf-v6-c-menu--BorderRadius', `${theme.shape.borderRadius}`);
      menu.style.setProperty('--pf-v6-c-menu--PaddingBlockStart', '8px');
      menu.style.setProperty('--pf-v6-c-menu--PaddingBlockEnd', '8px');
      menu.style.setProperty('--pf-v6-c-menu--PaddingInlineStart', '8px');
      menu.style.setProperty('--pf-v6-c-menu--PaddingInlineEnd', '8px');
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  menuItems.forEach((menuItem) => {
    // Check if the element is an instance of HTMLElement
    if (menuItem instanceof HTMLElement) {
      menuItem.style.setProperty('--pf-v6-c-menu__item--PaddingBlockStart', '6px');
      menuItem.style.setProperty('--pf-v6-c-menu__item--PaddingBlockEnd', '6px');
      menuItem.style.setProperty('--pf-v6-c-menu__item--PaddingInlineStart', '16px');
      menuItem.style.setProperty('--pf-v6-c-menu__item--PaddingInlineEnd', '16px');
      menuItem.style.setProperty(
        '--pf-v6-c-menu__item--FontSize',
        `${theme.typography.body1.fontSize}`,
      );
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  // Menu toggle
  menuToggles.forEach((menuToggle) => {
    // Check if the element is an instance of HTMLElement
    if (menuToggle instanceof HTMLElement) {
      menuToggle.style.setProperty('--pf-v6-c-menu-toggle__controls--MinWidth', '0');
      menuToggle.style.setProperty(
        '--pf-v6-c-menu-toggle--expanded--BackgroundColor',
        `${theme.palette.primary.main}`,
      );
      menuToggle.style.setProperty(
        '--pf-v6-c-menu-toggle--LineHeight',
        `${theme.typography.button.lineHeight}`,
      );
      menuToggle.style.setProperty('--pf-v6-c-menu-toggle--PaddingBlockStart', '6px');
      menuToggle.style.setProperty('--pf-v6-c-menu-toggle--PaddingBlockEnd', '6px');
      menuToggle.style.setProperty('--pf-v6-c-menu-toggle--PaddingInlineStart', '16px');
      menuToggle.style.setProperty('--pf-v6-c-menu-toggle--PaddingInlineEnd', '16px');
      menuToggle.style.setProperty('--pf-v6-c-menu-toggle--ColumnGap', '0');
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  // Table
  tableCells.forEach((tableCell) => {
    // Check if the element is an instance of HTMLElement
    if (tableCell instanceof HTMLElement) {
      tableCell.style.setProperty('--pf-v6-c-table--cell--Color', 'rgba(0, 0, 0, 0.87)');

      tableCell.style.setProperty('--pf-v6-c-table--cell--PaddingInlineStart', '16px');
      tableCell.style.setProperty('--pf-v6-c-table--cell--PaddingInlineEnd', '16px');
      tableCell.style.setProperty('--pf-v6-c-table--cell--PaddingBlockStart', '16px');
      tableCell.style.setProperty('--pf-v6-c-table--cell--PaddingBlockEnd', '16px');
      tableCell.style.setProperty('--pf-v6-c-table--cell--first-last-child--PaddingInline', '0px');
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  tableButtons.forEach((tableButton) => {
    // Check if the element is an instance of HTMLElement
    if (tableButton instanceof HTMLElement) {
      tableButton.style.setProperty('--pf-v6-c-table__button--BackgroundColor', 'none');
      tableButton.style.setProperty('--pf-v6-c-table__button--hover--BackgroundColor', 'none');
      tableButton.style.setProperty(
        '--pf-v6-c-table__button--Color',
        'var(--pf-v6-c-table--cell--Color)',
      );
      tableButton.style.setProperty('--pf-v6-c-table__button--PaddingBlockStart', '0');
      tableButton.style.setProperty('--pf-v6-c-table__button--PaddingBlockEnd', '0');
      tableButton.style.setProperty('--pf-v6-c-table__button--PaddingInlineStart', '0');
      tableButton.style.setProperty('--pf-v6-c-table__button--PaddingInlineEnd', '0');
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  tableSorts.forEach((tableSort) => {
    // Check if the element is an instance of HTMLElement
    if (tableSort instanceof HTMLElement) {
      tableSort.style.setProperty(
        '--pf-v6-c-table__sort--m-selected__button--Color',
        `${theme.palette.common.black}`,
      );
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  tableSortIndicators.forEach((tableSortIndicator) => {
    if (tableSortIndicator instanceof HTMLElement) {
      html.style.setProperty('--pf-v6-c-table__sort-indicator--Color', '#666');
      html.style.setProperty('--pf-v6-c-table__sort-indicator--MarginInlineStart', '4px');
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  tableHeaders.forEach((tableHeader) => {
    if (tableHeader instanceof HTMLElement) {
      tableHeader.style.setProperty('--pf-v6-c-table__thead--cell--FontWeight', '500');
      tableHeader.style.setProperty('--pf-v6-c-table__thead--cell--FontSize', '14px');
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  tableSortButtons.forEach((tableSortButton) => {
    if (tableSortButton instanceof HTMLElement) {
      tableSortButton.style.setProperty(
        '--pf-v6-c-table__sort__button--hover__sort-indicator--Color',
        '#00000050',
      );
      tableSortButton.style.setProperty(
        '--pf-v6-c-table__sort__button--hover__text--Color',
        '#00000099',
      );
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  tableRows.forEach((tableRow) => {
    if (tableRow instanceof HTMLElement) {
      tableRow.style.setProperty(
        '--pf-v6-c-table__tr--BorderBlockEndColor',
        'rgba(224, 224, 224, 1)',
      );
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  // Tabs
  tabsItems.forEach((tabsItem) => {
    // Check if the element is an instance of HTMLElement
    if (tabsItem instanceof HTMLElement) {
      tabsItem.style.setProperty('--pf-v6-c-tabs__item--PaddingBlockStart', '0');
      tabsItem.style.setProperty('--pf-v6-c-tabs__item--PaddingBlockEnd', '0');
      tabsItem.style.setProperty('--pf-v6-c-tabs__item--PaddingInlineStart', '0');
      tabsItem.style.setProperty(
        '--pf-v6-c-tabs__item--m-current__link--Color',
        'var(--pf-t--global--text--color--brand--default)',
      );
      tabsItem.style.setProperty(
        '--pf-v6-c-tabs__item--m-current__link--after--BorderWidth',
        '2px',
      );
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  tabsLinks.forEach((tabsLink) => {
    // Check if the element is an instance of HTMLElement
    if (tabsLink instanceof HTMLElement) {
      tabsLink.style.setProperty('--pf-v6-c-tabs__link--hover--BackgroundColor', 'transparent');
      tabsLink.style.setProperty('--pf-v6-c-tabs__link--PaddingInlineEnd', '0');
      tabsLink.style.setProperty('--pf-v6-c-tabs__link--PaddingBlockStart', '12px');
      tabsLink.style.setProperty('--pf-v6-c-tabs__link--PaddingBlockEnd', '12px');
      tabsLink.style.setProperty('--pf-v6-c-tabs__link--PaddingInlineStart', '16px');
      tabsLink.style.setProperty('--pf-v6-c-tabs__link--PaddingInlineEnd', '16px');
      tabsLink.style.setProperty('--pf-v6-c-tabs__link--FontSize', '0.875rem');
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  // Tab content
  tabContents.forEach((tabContent) => {
    // Check if the element is an instance of HTMLElement
    if (tabContent instanceof HTMLElement) {
      html.style.setProperty(
        '--pf-v6-c-tab-content__body--m-padding--PaddingBlockEnd',
        'var(--pf-t--global--spacer--lg)',
      );
      html.style.setProperty(
        '--pf-v6-c-tab-content__body--m-padding--PaddingBlockStart',
        'var(--pf-t--global--spacer--lg)',
      );
      html.style.setProperty(
        '--pf-v6-c-tab-content__body--m-padding--PaddingInlineEnd',
        'var(--pf-t--global--spacer--lg)',
      );
      html.style.setProperty(
        '--pf-v6-c-tab-content__body--m-padding--PaddingInlineStart',
        'var(--pf-t--global--spacer--lg)',
      );
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  // Label
  labels.forEach((label) => {
    if (label instanceof HTMLElement) {
      label.style.setProperty('--pf-v6-c-label--BorderRadius', '16px');
      label.style.setProperty('--pf-v6-c-label--FontSize', '0.8125rem');
      label.style.setProperty('--pf-v6-c-label--PaddingInlineStart', '0');
      label.style.setProperty('--pf-v6-c-label--PaddingInlineEnd', '0');
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });

  // Pagination menu toggle
  paginationMenuToggles.forEach((paginationMenuToggle) => {
    if (paginationMenuToggle instanceof HTMLElement) {
      paginationMenuToggle.style.setProperty(
        '--pf-v6-c-menu-toggle--expanded--BackgroundColor',
        'var(--pf-v6-c-menu-toggle--m-plain--expanded--BackgroundColor)',
      );
    } else {
      console.error('An element is not an HTMLElement.');
    }
  });
};
