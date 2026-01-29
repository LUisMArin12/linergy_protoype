import { useEffect, useMemo, useState } from 'react';
import type React from 'react';
import {
  Settings,
  RotateCcw,
  Layers,
  Gauge,
  Map,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

type IconSize = 'small' | 'normal' | 'large';

interface SettingsModel {
  /** Vista */
  rememberMapView: boolean;
  clusterMarkers: boolean;
  performanceMode: boolean;

  /** Apariencia del mapa */
  markerIconSize: IconSize;
  showMarkerLabels: boolean;
  highlightSelectedLine: boolean;
  smoothLines: boolean;
}

const STORAGE_KEY = 'linergy_settings';
const MAP_VIEW_KEY = 'linergy_last_map_view';

const DEFAULT_SETTINGS: SettingsModel = {
  rememberMapView: true,
  clusterMarkers: true,
  performanceMode: false,

  markerIconSize: 'normal',
  showMarkerLabels: true,
  highlightSelectedLine: true,
  smoothLines: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsModel>(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  const saveSettings = (next: SettingsModel) => {
    setSettings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const resetSettings = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MAP_VIEW_KEY);
    setSettings(DEFAULT_SETTINGS);
  };

  const restoreInitialMapView = () => {
    localStorage.removeItem(MAP_VIEW_KEY);
  };

  const hasChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS),
    [settings]
  );

  const toggle =
    (key: keyof SettingsModel) =>
    () =>
      saveSettings({ ...settings, [key]: !settings[key] });

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#F7FAF8]">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF3EA] flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#157A5A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Configuración del Mapa</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Preferencias visuales y de rendimiento.
              </p>
            </div>
          </div>

          <Button variant="secondary" onClick={resetSettings} disabled={!hasChanges}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restablecer
          </Button>
        </div>

        {/* Vista del mapa */}
        <Card className="p-6 space-y-4">
          <SectionTitle icon={Map} title="Vista del mapa" />

          <Toggle
            label="Recordar última vista del mapa"
            description="Guarda centro y zoom al salir."
            value={settings.rememberMapView}
            onToggle={toggle('rememberMapView')}
          />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Restaurar vista inicial</p>
              <p className="text-xs text-[#6B7280]">
                Elimina la vista guardada previamente.
              </p>
            </div>
            <Button variant="secondary" onClick={restoreInitialMapView}>
              Restaurar
            </Button>
          </div>
        </Card>

        {/* Rendimiento */}
        <Card className="p-6 space-y-4">
          <SectionTitle icon={Gauge} title="Rendimiento" />

          <Toggle
            label="Clúster de marcadores"
            description="Agrupa puntos cercanos para mejorar rendimiento."
            value={settings.clusterMarkers}
            onToggle={toggle('clusterMarkers')}
          />

          <Toggle
            label="Modo rendimiento"
            description="Reduce animaciones y elementos visibles."
            value={settings.performanceMode}
            onToggle={toggle('performanceMode')}
          />
        </Card>

        {/* Apariencia */}
        <Card className="p-6 space-y-4">
          <SectionTitle icon={Layers} title="Apariencia" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Tamaño de íconos</p>
              <p className="text-xs text-[#6B7280]">Marcadores del mapa</p>
            </div>
            <select
              value={settings.markerIconSize}
              onChange={(e) =>
                saveSettings({
                  ...settings,
                  markerIconSize: e.target.value as IconSize,
                })
              }
              className="border rounded-lg px-3 py-1 text-sm"
            >
              <option value="small">Pequeño</option>
              <option value="normal">Normal</option>
              <option value="large">Grande</option>
            </select>
          </div>

          <Toggle
            label="Mostrar etiquetas en marcadores"
            description="Número de estructura, km, etc."
            value={settings.showMarkerLabels}
            onToggle={toggle('showMarkerLabels')}
          />

          <Toggle
            label="Resaltar línea seleccionada"
            description="Enfoca visualmente la línea activa."
            value={settings.highlightSelectedLine}
            onToggle={toggle('highlightSelectedLine')}
          />

          <Toggle
            label="Suavizado de líneas"
            description="Curvas más suaves (mayor costo gráfico)."
            value={settings.smoothLines}
            onToggle={toggle('smoothLines')}
          />
        </Card>
      </div>
    </div>
  );
}

/* ---------- Helpers UI ---------- */

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-[#157A5A]" />
      <h2 className="text-sm font-semibold text-[#111827]">{title}</h2>
    </div>
  );
}

function Toggle({
  label,
  description,
  value,
  onToggle,
}: {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border bg-white">
      <div>
        <p className="text-sm font-medium text-[#111827]">{label}</p>
        <p className="text-xs text-[#6B7280] mt-1">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`w-11 h-6 rounded-full transition-colors ${
          value ? 'bg-[#157A5A]' : 'bg-[#E5E7EB]'
        }`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
            value ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}