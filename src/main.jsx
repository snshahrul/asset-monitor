import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { seedSampleData } from './utils/seedData.js';

// Seed data on first visit
seedSampleData();

// Global function for edit button
window.editEquipment = (id) => {
  const store = JSON.parse(localStorage.getItem('asset-monitor-storage'));
  if (store?.state) {
    store.state.selectedAssetId = id;
    localStorage.setItem('asset-monitor-storage', JSON.stringify(store));
    window.location.href = '/equipment/edit';
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
