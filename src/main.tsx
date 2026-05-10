import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

console.log('Mounting App...');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find root element');
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('App render called');
}
