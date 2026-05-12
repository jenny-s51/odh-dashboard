import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@odh-dashboard/base-distribution/ThemeContext';
import { ErrorBoundary } from '@odh-dashboard/base-distribution/ErrorBoundary';
import RhaiShell from './RhaiShell';

const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <ThemeProvider>
        <RhaiShell />
      </ThemeProvider>
    ),
  },
]);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>,
);
