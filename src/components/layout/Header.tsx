import { Search, PlusCircle, Share2, Menu } from 'lucide-react';
import Button from '../ui/Button';
import { useMapFocus } from '../../contexts/MapFocusContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onShare: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ onToggleSidebar, onShare, searchQuery, onSearchChange }: HeaderProps) {
  const { setIsRegisterFaultOpen } = useMapFocus();
  return (
    <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center gap-4">
      <button
        onClick={onToggleSidebar}
        className="p-2 hover:bg-[#F7FAF8] rounded-lg transition-colors lg:hidden"
      >
        <Menu className="w-5 h-5 text-[#6B7280]" />
      </button>

      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Buscar línea, estructura o falla..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#157A5A] focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={() => setIsRegisterFaultOpen(true)}
          className="hidden sm:flex"
        >
          Registrar falla
        </Button>
        <Button
          variant="secondary"
          icon={<Share2 className="w-4 h-4" />}
          onClick={onShare}
          className="hidden md:flex"
        >
          Compartir
        </Button>
      </div>
    </header>
  );
}
