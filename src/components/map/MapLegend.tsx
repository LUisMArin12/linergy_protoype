export default function MapLegend() {
  return (
    <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 bg-white rounded-lg shadow-lg border border-[#E5E7EB] p-3 lg:p-4 z-[500] max-w-[200px] lg:max-w-xs">
      <h3 className="text-xs lg:text-sm font-semibold text-[#111827] mb-2 lg:mb-3">Simbología</h3>

      <div className="space-y-2 lg:space-y-3">
        <div className="space-y-1.5 lg:space-y-2">
          <p className="text-[10px] lg:text-xs font-medium text-[#6B7280]">Infraestructura</p>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: '#8B5CF6', border: '2px solid white', boxShadow: '0 0 0 1px #E5E7EB' }}></div>
            <span className="text-[10px] lg:text-xs text-[#111827]">Subestación</span>
          </div>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#3B82F6', border: '2px solid white', boxShadow: '0 0 0 1px #E5E7EB' }}></div>
            <span className="text-[10px] lg:text-xs text-[#111827]">Estructura</span>
          </div>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <div className="w-4 h-0.5 bg-[#FF00FF] flex-shrink-0"></div>
            <span className="text-[10px] lg:text-xs text-[#111827]">Línea</span>
          </div>
        </div>

        <div className="space-y-1.5 lg:space-y-2 pt-1.5 lg:pt-2 border-t border-[#E5E7EB]">
          <p className="text-[10px] lg:text-xs font-medium text-[#6B7280]">Fallas</p>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: '#EF4444', border: '2px solid white', boxShadow: '0 0 0 1px #E5E7EB' }}></div>
            <span className="text-[10px] lg:text-xs text-[#111827]">Abierta</span>
          </div>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: '#F59E0B', border: '2px solid white', boxShadow: '0 0 0 1px #E5E7EB' }}></div>
            <span className="text-[10px] lg:text-xs text-[#111827]">En atención</span>
          </div>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: '#10B981', border: '2px solid white', boxShadow: '0 0 0 1px #E5E7EB' }}></div>
            <span className="text-[10px] lg:text-xs text-[#111827]">Cerrada (no visible)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
