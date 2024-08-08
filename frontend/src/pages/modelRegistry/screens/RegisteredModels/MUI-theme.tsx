// The import can be in any file that is included in your `tsconfig.json`
import type {} from '@mui/material/themeCssVarsAugmentation';
import { useTheme as muiUseTheme } from '@mui/material/styles';

// const html = document.documentElement;

// TODO: apply useTheme and access theme object
export const getTheme = () => {
  // console.log (theme);
  // console.log (theme.palette.action.active);
  const theme = muiUseTheme();
  console.log(theme);
  // console.log (window.theme);
};

// TODO: apply tokens like this next, investigate replacing CSS stylesheet with JS stylesheet
// html.style.setProperty('--pf-t--color--blue--50', theme.vars.palette.primary.main);
// html.style.setProperty('--pf-t--color--blue--100', theme.vars.palette.primary.light);
// html.style.setProperty('--pf-t--color--blue--50', theme.vars.palette.primary.main);
