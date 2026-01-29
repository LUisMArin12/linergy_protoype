import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---- Geometría (GeoJSON/WKT) ----
export type GeoPoint = { type: 'Point'; coordinates: [number, number] };
export type GeoLineString = { type: 'LineString'; coordinates: [number, number][] };
export type GeoMultiLineString = { type: 'MultiLineString'; coordinates: [number, number][][] };
export type Geometry = GeoPoint | GeoLineString | GeoMultiLineString;
export type GeometryInput = unknown;

export type Linea = {
  id: string;
  numero: string;
  nombre: string | null;
  km_inicio: number | null;
  km_fin: number | null;
  clasificacion: 'ALTA' | 'MODERADA' | 'BAJA';
  prioridad: number | null;
  geom: GeometryInput | null;
  created_at: string;
  updated_at: string;
};

export type Estructura = {
  id: string;
  linea_id: string;
  numero_estructura: string;
  km: number;
  geom: GeometryInput | null;
  created_at: string;
  updated_at: string;
};

export type Subestacion = {
  id: string;
  nombre: string;
  linea_id: string | null;
  geom: GeometryInput | null;
  created_at: string;
  updated_at: string;
};

export type Falla = {
  id: string;
  linea_id: string;
  km: number;
  tipo: string;
  descripcion: string | null;
  estado: 'ABIERTA' | 'EN_ATENCION' | 'CERRADA';
  ocurrencia_ts: string;
  geom: GeometryInput | null;
  created_at: string;
  updated_at: string;
};

function isNumPair(v: unknown): v is [number, number] {
  return Array.isArray(v) && v.length === 2 && Number.isFinite(v[0]) && Number.isFinite(v[1]);
}

export function parseGeometry(geom: GeometryInput): Geometry | null {
  if (!geom) return null;

  // 1) Ya viene como objeto GeoJSON
  if (typeof geom === 'object') {
    const g = geom as { type?: unknown; coordinates?: unknown };
    if (g.type === 'Point' && isNumPair(g.coordinates)) {
      return { type: 'Point', coordinates: g.coordinates };
    }
    if (g.type === 'LineString' && Array.isArray(g.coordinates) && g.coordinates.every(isNumPair)) {
      return { type: 'LineString', coordinates: g.coordinates };
    }
    if (
      g.type === 'MultiLineString' &&
      Array.isArray(g.coordinates) &&
      g.coordinates.every(
        (seg) => Array.isArray(seg) && seg.every(isNumPair)
      )
    ) {
      return { type: 'MultiLineString', coordinates: g.coordinates as [number, number][][] };
    }
  }

  // 2) Si es string: JSON o WKT
  if (typeof geom !== 'string') return null;

  // JSON string
  try {
    const parsed = JSON.parse(geom) as unknown;
    const asGeo = parseGeometry(parsed);
    if (asGeo) return asGeo;
  } catch {
    // ignore
  }

  const wkt = geom.trim();

  if (wkt.toUpperCase().startsWith('POINT')) {
    const match = wkt.match(/POINT\s*\(\s*([\-\d.]+)\s+([\-\d.]+)\s*\)/i);
    if (match) {
      const lon = Number(match[1]);
      const lat = Number(match[2]);
      if (Number.isFinite(lon) && Number.isFinite(lat)) {
        return { type: 'Point', coordinates: [lon, lat] };
      }
    }
  }

  if (wkt.toUpperCase().startsWith('LINESTRING')) {
    const match = wkt.match(/LINESTRING\s*\((.+)\)/i);
    if (match) {
      const coords = match[1]
        .split(',')
        .map((pair) => pair.trim().split(/\s+/).slice(0, 2))
        .map(([lon, lat]) => [Number(lon), Number(lat)] as [number, number])
        .filter((c) => Number.isFinite(c[0]) && Number.isFinite(c[1]));
      if (coords.length >= 2) return { type: 'LineString', coordinates: coords };
    }
  }

  return null;
}

// ---- Helpers para Edge Functions ----

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function parseFetchError(response: Response): Promise<string> {
  const contentType = response.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) {
      const json = await response.json();
      return json?.error || json?.message || JSON.stringify(json);
    }
    const text = await response.text();
    return text || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

async function buildFunctionHeaders(isJsonBody: boolean) {
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${token ?? supabaseAnonKey}`,
  };
  if (isJsonBody) headers['Content-Type'] = 'application/json';
  return headers;
}

// ---- Funciones públicas ----

/**
 * Normaliza la respuesta del Edge Function para siempre regresar:
 * { lat: number, lon: number }
 *
 * Acepta cualquiera de estos formatos:
 * - { lat, lon } / { lat, lng } / { latitude, longitude }
 * - { data: { lat, lon } } / { data: { lat, lng } }
 * - { geom: "POINT(lon lat)" } / { wkt: "POINT(lon lat)" }
 * - { geom: { type:'Point', coordinates:[lon,lat] } } (GeoJSON)
 */
export async function computeFaultLocation(
  lineaId: string,
  km: number
): Promise<{ lat: number; lon: number }> {
  const headers = await buildFunctionHeaders(true);

  const response = await fetch(`${supabaseUrl}/functions/v1/compute-fault-location`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ lineaId, km }),
  });

  if (!response.ok) {
    const msg = await parseFetchError(response);
    throw new Error(msg || 'Failed to compute location');
  }

  const payload = await response.json();

  // 1) Intento directo: múltiples variantes
  const latDirect =
    payload?.lat ??
    payload?.latitude ??
    payload?.data?.lat ??
    payload?.data?.latitude ??
    payload?.location?.lat ??
    payload?.location?.latitude;

  const lonDirect =
    payload?.lon ??
    payload?.lng ?? // <- común en mapas
    payload?.longitude ??
    payload?.data?.lon ??
    payload?.data?.lng ??
    payload?.data?.longitude ??
    payload?.location?.lon ??
    payload?.location?.lng ??
    payload?.location?.longitude;

  const lat1 = Number(latDirect);
  const lon1 = Number(lonDirect);

  if (Number.isFinite(lat1) && Number.isFinite(lon1)) {
    return { lat: lat1, lon: lon1 };
  }

  // 2) Si viene WKT: payload.geom / payload.wkt / payload.geom_wkt
  const wkt: string | undefined =
    typeof payload?.geom === 'string'
      ? payload.geom
      : typeof payload?.wkt === 'string'
      ? payload.wkt
      : typeof payload?.geom_wkt === 'string'
      ? payload.geom_wkt
      : undefined;

  if (wkt && wkt.toUpperCase().startsWith('POINT')) {
    const match = wkt.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
    if (match) {
      const lon = Number(match[1]);
      const lat = Number(match[2]);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        return { lat, lon };
      }
    }
  }

  // 3) Si viene GeoJSON: { type:'Point', coordinates:[lon,lat] }
  const geo =
    payload?.geom && typeof payload.geom === 'object'
      ? payload.geom
      : payload?.geometry && typeof payload.geometry === 'object'
      ? payload.geometry
      : null;

  const coords =
    geo?.type === 'Point' && Array.isArray(geo.coordinates) ? geo.coordinates : null;

  if (coords && coords.length >= 2) {
    const lon = Number(coords[0]);
    const lat = Number(coords[1]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      return { lat, lon };
    }
  }

  // 4) No se pudo interpretar: devuelve payload para debug
  throw new Error(
    `compute-fault-location devolvió un formato inesperado: ${JSON.stringify(payload)}`
  );
}

export async function importKMZ(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const headers = await buildFunctionHeaders(false);

  const response = await fetch(`${supabaseUrl}/functions/v1/import-kmz`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const msg = await parseFetchError(response);
    throw new Error(msg || 'Failed to import KMZ');
  }

  return response.json();
}

export interface UpdateFallaPayload {
  lineaId?: string;
  km?: number;
  tipo?: string;
  descripcion?: string | null;
  estado?: 'ABIERTA' | 'EN_ATENCION' | 'CERRADA';
  fecha?: string;
  hora?: string;
}

export async function updateFalla(fallaId: string, payload: UpdateFallaPayload) {
  let geomWkt: string | undefined;

  if (payload.lineaId !== undefined && payload.km !== undefined) {
    const location = await computeFaultLocation(payload.lineaId, payload.km);
    geomWkt = `POINT(${location.lon} ${location.lat})`;
  }

  let ocurrenciaTs: string | undefined;
  if (payload.fecha !== undefined && payload.hora !== undefined) {
    ocurrenciaTs = new Date(`${payload.fecha}T${payload.hora}`).toISOString();
  }

  const updateData: Record<string, unknown> = {};
  if (payload.lineaId !== undefined) updateData.linea_id = payload.lineaId;
  if (payload.km !== undefined) updateData.km = payload.km;
  if (payload.tipo !== undefined) updateData.tipo = payload.tipo;
  if (payload.descripcion !== undefined) updateData.descripcion = payload.descripcion;
  if (payload.estado !== undefined) updateData.estado = payload.estado;
  if (ocurrenciaTs !== undefined) updateData.ocurrencia_ts = ocurrenciaTs;
  if (geomWkt !== undefined) {
    const { error } = await supabase.rpc('update_falla_geom', {
      p_falla_id: fallaId,
      p_geom_wkt: geomWkt,
    });
    if (error) throw error;
  }

  const { data, error } = await supabase
    .from('fallas')
    .update(updateData)
    .eq('id', fallaId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFalla(fallaId: string) {
  const { error } = await supabase.from('fallas').delete().eq('id', fallaId);
  if (error) throw error;
}

export async function setFallaEstado(
  fallaId: string,
  estado: 'ABIERTA' | 'EN_ATENCION' | 'CERRADA'
) {
  const { data, error } = await supabase
    .from('fallas')
    .update({ estado })
    .eq('id', fallaId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
