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
    console.log("spacing", theme.spacing(6));
    console.log("columnGap", theme.unstable_sxConfig.columnGap);
    return theme;
    // console.log (window.theme);
  };
  getTheme();

  html.style.setProperty('--pf-t--color--blue--500', theme.palette.primary.main);
  // Alert
  // html.style.setProperty('--pf-v6-c-alert--m-warning__title--Color', '--pf-t--global--text--color--status--warning--default');
  html.style.setProperty('--pf-v6-c-alert__icon--MarginInlineEnd', '12');
  // html.style.setProperty('--pf-v6-c-alert__title--FontWeight', 'var(--mui-alert-warning-font-weight)');
  // html.style.setProperty('--pf-v6-c-alert__icon--MarginInlineEnd', '12px');
  // html.style.setProperty('--pf-v6-c-alert__icon--MarginBlockStart', '7px');
  // html.style.setProperty('--pf-v6-c-alert__icon--FontSize', '22px');
  // html.style.setProperty('--pf-v6-c-alert--BoxShadow', 'none');
  // html.style.setProperty('--pf-v6-c-alert--PaddingBlockStart', '6px');
  // html.style.setProperty('--pf-v6-c-alert--PaddingBlockEnd', '6px');
  // html.style.setProperty('--pf-v6-c-alert--PaddingInlineStart', '16px');
  // html.style.setProperty('--pf-v6-c-alert--PaddingInlineStart', '16px');

  // Button
  html.style.setProperty('--pf-v6-c-button--FontWeight', 'var(--mui-button-font-weight)');
  html.style.setProperty('--pf-v6-c-button--PaddingBlockStart', '6px');
  html.style.setProperty('--pf-v6-c-button--PaddingBlockEnd', '6px');
  html.style.setProperty('-pf-v6-c-button--PaddingInlineStart', '16px');
  html.style.setProperty('--pf-v6-c-button--PaddingInlineEnd', '16px');
  html.style.setProperty('pf-v6-c-button--LineHeight', '1.75');

  // Menu
  html.style.setProperty('--pf-v6-c-menu--BoxShadow', theme.shadows[8]);
  html.style.setProperty('--pf-v6-c-menu--BorderRadius', `${theme.shape.borderRadius}`);
  html.style.setProperty('--pf-v6-c-menu--PaddingBlockStart', '8px');
  html.style.setProperty('--pf-v6-c-menu--PaddingBlockEnd', '8px');
  html.style.setProperty('--pf-v6-c-menu--PaddingInlineStart', '8px');
  html.style.setProperty('--pf-v6-c-menu--PaddingInlineEnd', '8px');
  html.style.setProperty('--pf-v6-c-menu__item--PaddingBlockStart', '6px');
  html.style.setProperty('--pf-v6-c-menu__item--PaddingBlockEnd', '6px');
  html.style.setProperty('--pf-v6-c-menu__item--PaddingInlineStart', '16px');
  html.style.setProperty('--pf-v6-c-menu__item--PaddingInlineEnd', '16px');
  html.style.setProperty('--pf-v6-c-menu__item--FontSize', `${theme.typography.body1.fontSize}`);

  // Menu toggle
  html.style.setProperty('--pf-v6-c-menu-toggle__controls--MinWidth', '0');
  html.style.setProperty('--pf-v6-c-menu-toggle--expanded--BackgroundColor', `${theme.palette.primary.main}`);
  html.style.setProperty('--pf-v6-c-menu-toggle--LineHeight', `${theme.typography.button.lineHeight}`);
  html.style.setProperty('--pf-v6-c-menu-toggle--PaddingBlockStart', '6px');
  html.style.setProperty('--pf-v6-c-menu-toggle--PaddingBlockEnd', '6px');
  html.style.setProperty('--pf-v6-c-menu-toggle--PaddingInlineStart', '16px');
  html.style.setProperty('--pf-v6-c-menu-toggle--PaddingInlineEnd', '16px');
  html.style.setProperty('--pf-v6-c-menu-toggle--ColumnGap', '0');

 // Table

 html.style.setProperty('--pf-v6-c-table__sort--m-selected__button--Color',' #000000de');
 html.style.setProperty('--pf-v6-c-table__button--BackgroundColor', 'none');
 html.style.setProperty('--pf-v6-c-table__button--hover--BackgroundColor', 'none');
 html.style.setProperty('--pf-v6-c-table__sort-indicator--Color', '#666');
 html.style.setProperty('--pf-v6-c-table__sort__button--hover__sort-indicator--Color', '#00000050');
 html.style.setProperty('--pf-v6-c-table__sort__button--hover__text--Color', '#00000099');
 html.style.setProperty('--pf-v6-c-table--cell--Color', 'rgba(0, 0, 0, 0.87)');
 html.style.setProperty('--pf-v6-c-table__button--Color', 'var(--pf-v6-c-table--cell--Color)');
 html.style.setProperty('--pf-v6-c-table__button--PaddingBlockStart', '0');
 html.style.setProperty('--pf-v6-c-table__button--PaddingBlockEnd', '0');
 html.style.setProperty('--pf-v6-c-table__button--PaddingInlineStart', '0');
 html.style.setProperty('--pf-v6-c-table__button--PaddingInlineEnd', '0');
 html.style.setProperty('--pf-v6-c-table--cell--PaddingInlineStart', '16px');
 html.style.setProperty('--pf-v6-c-table--cell--PaddingInlineEnd', '16px');
 html.style.setProperty('--pf-v6-c-table--cell--PaddingBlockStart', '16px');
 html.style.setProperty('--pf-v6-c-table--cell--PaddingBlockEnd', '16px');
 html.style.setProperty('--pf-v6-c-table--cell--first-last-child--PaddingInline', '0px');
 html.style.setProperty('--pf-v6-c-table__thead--cell--FontWeight', '500');
 html.style.setProperty('--pf-v6-c-table__thead--cell--FontSize', '14px');
 html.style.setProperty('--pf-v6-c-table__tr--BorderBlockEndColor', 'rgba(224, 224, 224, 1)');
 html.style.setProperty('--pf-v6-c-table__sort-indicator--MarginInlineStart', '4px');


};

// TODO: apply tokens like this next, investigate replacing CSS stylesheet with JS stylesheet
