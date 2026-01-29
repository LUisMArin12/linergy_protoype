import { Line, Structure, Fault, Substation } from '../types';

export const mockLines: Line[] = [
  {
    id: '1',
    numero: 'LT-220-001',
    rangoKm: '0 - 45.3',
    clasificacion: 'Alta',
    prioridad: 1
  },
  {
    id: '2',
    numero: 'LT-220-002',
    rangoKm: '0 - 32.8',
    clasificacion: 'Alta',
    prioridad: 2
  },
  {
    id: '3',
    numero: 'LT-138-003',
    rangoKm: '0 - 28.5',
    clasificacion: 'Moderada',
    prioridad: 3
  },
  {
    id: '4',
    numero: 'LT-138-004',
    rangoKm: '0 - 51.2',
    clasificacion: 'Moderada',
    prioridad: 2
  },
  {
    id: '5',
    numero: 'LT-069-005',
    rangoKm: '0 - 18.4',
    clasificacion: 'Baja',
    prioridad: 4
  }
];

export const mockStructures: Structure[] = [
  { id: 's1', numero: 'E-001', lineaId: '1', lineaNumero: 'LT-220-001', km: 2.3, clasificacion: 'Alta', lat: -12.0464, lon: -77.0428 },
  { id: 's2', numero: 'E-002', lineaId: '1', lineaNumero: 'LT-220-001', km: 4.1, clasificacion: 'Alta', lat: -12.0454, lon: -77.0418 },
  { id: 's3', numero: 'E-003', lineaId: '1', lineaNumero: 'LT-220-001', km: 6.8, clasificacion: 'Moderada', lat: -12.0444, lon: -77.0408 },
  { id: 's4', numero: 'E-004', lineaId: '1', lineaNumero: 'LT-220-001', km: 9.2, clasificacion: 'Alta', lat: -12.0434, lon: -77.0398 },
  { id: 's5', numero: 'E-005', lineaId: '2', lineaNumero: 'LT-220-002', km: 1.5, clasificacion: 'Alta', lat: -12.0424, lon: -77.0388 },
  { id: 's6', numero: 'E-006', lineaId: '2', lineaNumero: 'LT-220-002', km: 3.7, clasificacion: 'Moderada', lat: -12.0414, lon: -77.0378 },
  { id: 's7', numero: 'E-007', lineaId: '2', lineaNumero: 'LT-220-002', km: 5.9, clasificacion: 'Alta', lat: -12.0404, lon: -77.0368 },
  { id: 's8', numero: 'E-008', lineaId: '3', lineaNumero: 'LT-138-003', km: 2.1, clasificacion: 'Moderada', lat: -12.0394, lon: -77.0358 },
  { id: 's9', numero: 'E-009', lineaId: '3', lineaNumero: 'LT-138-003', km: 4.3, clasificacion: 'Baja', lat: -12.0384, lon: -77.0348 },
  { id: 's10', numero: 'E-010', lineaId: '3', lineaNumero: 'LT-138-003', km: 6.5, clasificacion: 'Moderada', lat: -12.0374, lon: -77.0338 },
  { id: 's11', numero: 'E-011', lineaId: '4', lineaNumero: 'LT-138-004', km: 3.2, clasificacion: 'Moderada', lat: -12.0364, lon: -77.0328 },
  { id: 's12', numero: 'E-012', lineaId: '4', lineaNumero: 'LT-138-004', km: 5.4, clasificacion: 'Alta', lat: -12.0354, lon: -77.0318 },
  { id: 's13', numero: 'E-013', lineaId: '4', lineaNumero: 'LT-138-004', km: 7.6, clasificacion: 'Moderada', lat: -12.0344, lon: -77.0308 },
  { id: 's14', numero: 'E-014', lineaId: '4', lineaNumero: 'LT-138-004', km: 9.8, clasificacion: 'Moderada', lat: -12.0334, lon: -77.0298 },
  { id: 's15', numero: 'E-015', lineaId: '5', lineaNumero: 'LT-069-005', km: 1.2, clasificacion: 'Baja', lat: -12.0324, lon: -77.0288 },
  { id: 's16', numero: 'E-016', lineaId: '5', lineaNumero: 'LT-069-005', km: 3.4, clasificacion: 'Baja', lat: -12.0314, lon: -77.0278 },
  { id: 's17', numero: 'E-017', lineaId: '5', lineaNumero: 'LT-069-005', km: 5.6, clasificacion: 'Moderada', lat: -12.0304, lon: -77.0268 },
  { id: 's18', numero: 'E-018', lineaId: '1', lineaNumero: 'LT-220-001', km: 11.5, clasificacion: 'Alta', lat: -12.0294, lon: -77.0258 },
  { id: 's19', numero: 'E-019', lineaId: '2', lineaNumero: 'LT-220-002', km: 8.1, clasificacion: 'Moderada', lat: -12.0284, lon: -77.0248 },
  { id: 's20', numero: 'E-020', lineaId: '3', lineaNumero: 'LT-138-003', km: 8.7, clasificacion: 'Moderada', lat: -12.0274, lon: -77.0238 }
];

export const mockFaults: Fault[] = [
  {
    id: 'f1',
    lineaNumero: 'LT-220-001',
    km: 4.5,
    tipo: 'Conductor caído',
    estado: 'Abierta',
    fecha: '2026-01-14',
    hora: '08:30',
    lat: -12.0456,
    lon: -77.0420,
    descripcion: 'Conductor fase B caído por viento'
  },
  {
    id: 'f2',
    lineaNumero: 'LT-220-002',
    km: 12.3,
    tipo: 'Aislador roto',
    estado: 'En atención',
    fecha: '2026-01-13',
    hora: '14:15',
    lat: -12.0390,
    lon: -77.0350,
    descripcion: 'Aislador de suspensión dañado'
  },
  {
    id: 'f3',
    lineaNumero: 'LT-138-003',
    km: 7.8,
    tipo: 'Torre inclinada',
    estado: 'Abierta',
    fecha: '2026-01-15',
    hora: '06:45',
    lat: -12.0370,
    lon: -77.0340,
    descripcion: 'Torre con inclinación de 15 grados'
  },
  {
    id: 'f4',
    lineaNumero: 'LT-138-004',
    km: 23.1,
    tipo: 'Vegetación cerca',
    estado: 'Cerrada',
    fecha: '2026-01-10',
    hora: '11:20',
    lat: -12.0330,
    lon: -77.0290,
    descripcion: 'Árbol podado, distancia segura restablecida'
  },
  {
    id: 'f5',
    lineaNumero: 'LT-069-005',
    km: 4.2,
    tipo: 'Corrosión',
    estado: 'En atención',
    fecha: '2026-01-12',
    hora: '16:50',
    lat: -12.0310,
    lon: -77.0275,
    descripcion: 'Corrosión avanzada en base de torre'
  }
];

export const mockSubstations: Substation[] = [
  { id: 'sub1', nombre: 'SE Industriales', lat: -12.0480, lon: -77.0450 },
  { id: 'sub2', nombre: 'SE Norte', lat: -12.0250, lon: -77.0220 },
  { id: 'sub3', nombre: 'SE Central', lat: -12.0360, lon: -77.0320 }
];
