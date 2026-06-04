import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<div style={{ padding: '2rem' }}>RHAII Distribution</div>);
}
