import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { ErrorBoundary } from './ErrorBoundary';
import Shell from './Shell';

const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <ThemeProvider>
        <Shell />
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
