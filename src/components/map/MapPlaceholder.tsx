import { MapPin, AlertTriangle, Building2 } from 'lucide-react';
import { Structure, Fault, Substation } from '../../types';

interface MapPlaceholderProps {
  structures: Structure[];
  faults: Fault[];
  substations: Substation[];
  onSelectStructure: (s: Structure) => void;
  onSelectFault: (f: Fault) => void;
}

export default function MapPlaceholder({
  structures,
  faults,
  substations,
  onSelectStructure,
  onSelectFault,
}: MapPlaceholderProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 h-full relative overflow-hidden">
      <div className="absolute top-4 right-4 bg-white rounded-lg border border-[#E5E7EB] shadow-lg p-3 z-10">
        <p className="text-xs font-semibold text-[#111827] mb-2">Leyenda</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#157A5A]" />
            <span className="text-xs text-[#6B7280]">Estructura</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-xs text-[#6B7280]">Falla</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-[#6B7280]">Subestación</span>
          </div>
        </div>
      </div>

      <svg className="w-full h-full" viewBox="0 0 800 600">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="800" height="600" fill="url(#grid)" />

        <polyline
          points="100,150 200,180 350,120 500,200 650,160"
          fill="none"
          stroke="#157A5A"
          strokeWidth="3"
          opacity="0.6"
        />

        <polyline
          points="150,350 280,320 420,380 580,340"
          fill="none"
          stroke="#157A5A"
          strokeWidth="3"
          opacity="0.6"
        />

        {substations.map((sub, idx) => (
          <g key={sub.id}>
            <circle
              cx={150 + idx * 250}
              cy={200 + idx * 50}
              r="8"
              fill="#3B82F6"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={150 + idx * 250}
              y={225 + idx * 50}
              fontSize="10"
              textAnchor="middle"
              fill="#111827"
              className="font-medium"
            >
              {sub.nombre}
            </text>
          </g>
        ))}

        {structures.slice(0, 8).map((structure, idx) => {
          const x = 100 + idx * 80;
          const y = idx % 2 === 0 ? 150 + idx * 15 : 320 + idx * 10;
          return (
            <g
              key={structure.id}
              onClick={() => onSelectStructure(structure)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <circle cx={x} cy={y} r="6" fill="#157A5A" stroke="white" strokeWidth="2" />
              <text
                x={x}
                y={y - 12}
                fontSize="9"
                textAnchor="middle"
                fill="#111827"
                className="font-medium"
              >
                {structure.numero}
              </text>
            </g>
          );
        })}

        {faults.slice(0, 3).map((fault, idx) => {
          const x = 250 + idx * 150;
          const y = 180 + idx * 80;
          return (
            <g
              key={fault.id}
              onClick={() => onSelectFault(fault)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <circle cx={x} cy={y} r="8" fill="#EF4444" stroke="white" strokeWidth="2" className="animate-pulse" />
              <text
                x={x}
                y={y + 20}
                fontSize="9"
                textAnchor="middle"
                fill="#EF4444"
                className="font-semibold"
              >
                {fault.tipo}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
