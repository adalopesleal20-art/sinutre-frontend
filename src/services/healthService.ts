import { api } from '@/lib/api';

export interface HealthData {
  height: number | null;
  weight: number | null;
  targetDietDaily: number | null;
  levelActivity: string | null;
}

export interface SaveHealthData {
  height: number;
  weight: number;
  targetDietDaily: number;
  levelActivity: string;
}

export async function getHealthData() {
  const response =
    await api.get<HealthData>('/health-data');

  return response.data;
}

export async function saveHealthData(
  data: SaveHealthData,
) {
  const response = await api.put(
    '/health-data',
    data,
  );

  return response.data;
}