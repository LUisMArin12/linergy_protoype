import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSearch } from '../../contexts/SearchContext';

interface AppLayoutProps {
  onShare: () => void;
}

export default function AppLayout({ onShare }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className="min-h-screen bg-[#F7FAF8]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '256px' : '72px' }}
      >
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onShare={onShare}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
