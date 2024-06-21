import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function BodyClassSetter() {
  useEffect(() => {
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 700);
  }, []);

  return null; // Return null, as this component doesn't render anything
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BodyClassSetter />
    <App />
  </React.StrictMode>,
);