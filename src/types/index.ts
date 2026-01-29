export type Classification = 'Alta' | 'Moderada' | 'Baja';
export type FaultStatus = 'Abierta' | 'En atención' | 'Cerrada';
export type Priority = 1 | 2 | 3 | 4 | 5;

export interface Line {
  id: string;
  numero: string;
  rangoKm: string;
  clasificacion: Classification;
  prioridad: Priority;
}

export interface Structure {
  id: string;
  numero: string;
  lineaId: string;
  lineaNumero: string;
  km: number;
  clasificacion: Classification;
  lat: number;
  lon: number;
}

export interface Fault {
  id: string;
  lineaNumero: string;
  km: number;
  tipo: string;
  estado: FaultStatus;
  fecha: string;
  hora: string;
  lat: number;
  lon: number;
  descripcion: string;
}

export interface Substation {
  id: string;
  nombre: string;
  lat: number;
  lon: number;
}
