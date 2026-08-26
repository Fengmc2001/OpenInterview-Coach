import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CoachApp from '../app/coach';
import '../app/globals.css';

const root = document.getElementById('root');

if (!root) throw new Error('The application root element is missing.');

createRoot(root).render(
  <StrictMode>
    <CoachApp />
  </StrictMode>,
);
