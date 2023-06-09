import React from 'react';
import { createRoot } from 'react-dom/client';

import reportWebVitals from './reportWebVitals';

import AppWrapper from 'app/App';
import 'moment/locale/vi';
import './i18n';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  // <React.StrictMode>
  <AppWrapper />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
