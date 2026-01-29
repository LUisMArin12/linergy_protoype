import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Cable, UploadCloud, FileText, LogOut, Settings } from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '../../lib/supabase';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    section: 'Operación',
    items: [
      { to: '/dashboard/mapa', icon: Map, label: 'Mapa' },
      { to: '/dashboard/reportes', icon: FileText, label: 'Reportes' },
    ],
  },
  {
    section: 'Administración',
    items: [
      { to: '/dashboard/admin/lineas', icon: Cable, label: 'Líneas' },
      { to: '/dashboard/admin/importar', icon: UploadCloud, label: 'Importar KMZ' },
    ],
  },
  {
    section: 'Sistema',
    items: [
      { to: '/dashboard/configuracion', icon: Settings, label: 'Configuración' },
    ],
  },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // noop
    }
    navigate('/', { replace: true });
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 72 }}
      className="bg-white border-r border-[#E5E7EB] flex flex-col h-screen fixed left-0 top-0 z-30"
    >
      <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src="/image.png" alt="LINERGY" className="w-full h-full object-contain" />
        </div>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden"
          >
            <h1 className="text-lg font-bold text-[#0B3D2E]">LINERGY</h1>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            {isOpen && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 mb-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider"
              >
                {section.section}
              </motion.p>
            )}
            <div className="space-y-1 px-2">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      'hover:bg-[#F7FAF8] group',
                      {
                        'bg-[#DDF3EA] border-l-4 border-[#157A5A] text-[#0B3D2E] font-medium': isActive,
                        'text-[#6B7280]': !isActive,
                      }
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={clsx(
                          'w-5 h-5 flex-shrink-0',
                          isActive ? 'text-[#157A5A]' : 'text-[#6B7280] group-hover:text-[#157A5A]'
                        )}
                      />
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer fijo SOLO con botón Salir */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <button
          type="button"
          onClick={handleLogout}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
            'hover:bg-red-50 group',
            !isOpen && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5 text-red-600 group-hover:text-red-700 flex-shrink-0" />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium text-red-600 group-hover:text-red-700 whitespace-nowrap"
            >
              Salir del sistema
            </motion.span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}