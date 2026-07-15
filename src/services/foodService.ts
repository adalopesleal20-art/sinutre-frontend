import { api } from '@/lib/api';
import { Food } from '@/types/food';

export async function getFoods() {
  const response = await api.get<Food[]>('/foods');
  return response.data;
}

export async function createFood(
  food: Omit<Food, 'id'>,
) {
  const response = await api.post(
    '/foods',
    food,
  );

  return response.data;
}

export async function searchFoods(
  search: string,
) {
  const response = await api.get('/foods', {
    params: {
      search,
    },
  });

 return response.data;

}

export async function deleteFood(id: number) {
  await api.delete(`/foods/${id}`);
}