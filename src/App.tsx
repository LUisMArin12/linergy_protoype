// src/App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import WelcomePage from './pages/WelcomePage';
import MapPage from './pages/MapPage';
import ReportsPage from './pages/ReportsPage';
import AdminLinesPage from './pages/AdminLinesPage';
import AdminImportPage from './pages/AdminImportPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import RegisterFaultModal from './components/modals/RegisterFaultModal';
import ShareModal from './components/modals/ShareModal';
import { ToastProvider } from './contexts/ToastContext';
import { SearchProvider } from './contexts/SearchContext';
import { MapFocusProvider } from './contexts/MapFocusContext';

export default function App() {
  const [showShare, setShowShare] = useState(false);

  return (
    <BrowserRouter>
      <ToastProvider>
        <SearchProvider>
          {/*  MapFocusProvider DEBE estar dentro del Router */}
          <MapFocusProvider>
            <Routes>
              <Route path="/" element={<WelcomePage />} />

              <Route path="/dashboard" element={<AppLayout onShare={() => setShowShare(true)} />}>
                <Route index element={<Navigate to="/dashboard/mapa" replace />} />
                <Route path="mapa" element={<MapPage />} />
                <Route path="reportes" element={<ReportsPage />} />
                <Route path="admin/lineas" element={<AdminLinesPage />} />
                <Route path="admin/importar" element={<AdminImportPage />} />
                <Route path="configuracion" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>

            {/*  Modales dentro de providers (por si usan context) */}
            <RegisterFaultModal />

            <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} />
          </MapFocusProvider>
        </SearchProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}