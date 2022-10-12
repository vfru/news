import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './util/http'
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

export {root}