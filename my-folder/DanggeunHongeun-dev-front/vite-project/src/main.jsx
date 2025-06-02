import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
       {/* ✅ App을 ProductProvider로 감쌈 */}
      <App />
  </StrictMode>
);
