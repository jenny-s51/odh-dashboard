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
    console.log(theme.spacing());
    return theme;
    // console.log (window.theme);
  };
  getTheme();

  html.style.setProperty('--pf-t--color--blue--500', theme.palette.primary.main);
  // Alert
  // html.style.setProperty('--pf-v6-c-alert--m-warning__title--Color', '--pf-t--global--text--color--status--warning--default');
  // html.style.setProperty('--pf-v6-c-alert__icon--MarginInlineEnd', '12px');
  // html.style.setProperty('--pf-v6-c-alert__title--FontWeight', 'var(--mui-alert-warning-font-weight)');
  // html.style.setProperty('--pf-v6-c-alert__icon--MarginInlineEnd', '12px');
  // html.style.setProperty('--pf-v6-c-alert__icon--MarginBlockStart', '7px');
  // html.style.setProperty('--pf-v6-c-alert__icon--FontSize', '22px');
  // html.style.setProperty('--pf-v6-c-alert--BoxShadow', 'none');
  // html.style.setProperty('--pf-v6-c-alert--PaddingBlockStart', '6px');
  // html.style.setProperty('--pf-v6-c-alert--PaddingBlockEnd', '6px');
  // html.style.setProperty('--pf-v6-c-alert--PaddingInlineStart', '16px');
  // html.style.setProperty('--pf-v6-c-alert--PaddingInlineStart', '16px');
};

// TODO: apply tokens like this next, investigate replacing CSS stylesheet with JS stylesheet
