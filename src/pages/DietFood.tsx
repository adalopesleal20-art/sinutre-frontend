import { useEffect, useState } from 'react';
import { Plus } from '@phosphor-icons/react';

import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { AddFoodModal } from '@/components/modal/AddFoodModal';
import { EditFoodModal } from '@/components/modal/EditFoodModal';

import {
  deleteFood,
  getFoods,
} from '@/services/foodService';

import type { Food } from '@/types/food';

const CREATE_MODAL_ID = 'create-food-modal';
const EDIT_MODAL_ID = 'edit-food-modal';

export function DietFoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] =
    useState<Food | null>(null);

  async function loadFoods() {
    try {
      const data = await getFoods();
      setFoods(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      'Deseja realmente excluir este alimento?',
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFood(id);
      await loadFoods();
    } catch {
      window.alert(
        'Não foi possível excluir o alimento.',
      );
    }
  }

  function handleEdit(food: Food) {
    setSelectedFood(food);

    setTimeout(() => {
      (
        document.getElementById(
          EDIT_MODAL_ID,
        ) as HTMLDialogElement
      )?.showModal();
    }, 0);
  }

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader
        title="Dieta"
        subtitle="Gerencie seus alimentos"
      />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid gap-4 mt-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="card bg-base-100 shadow-sm"
            >
              <div className="card-body">
                <h2 className="card-title">
                  {food.name}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <span>
                    🔥 {food.caloriesPer100g} kcal
                  </span>

                  <span>
                    🍞 {food.carbsPer100g} g
                  </span>

                  <span>
                    🍗 {food.proteinPer100g} g
                  </span>

                  <span>
                    🥑 {food.fatPer100g} g
                  </span>
                </div>

                <div className="card-actions justify-end mt-4">
                  <button
                    type="button"
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                      handleEdit(food)
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="btn btn-error btn-sm"
                    onClick={() =>
                      handleDelete(food.id)
                    }
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        aria-label="Adicionar alimento"
        className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-6 shadow-lg z-50"
        onClick={() =>
          (
            document.getElementById(
              CREATE_MODAL_ID,
            ) as HTMLDialogElement
          )?.showModal()
        }
      >
        <Plus size={24} weight="bold" />
      </button>

      <AddFoodModal
        modalId={CREATE_MODAL_ID}
        onCreated={loadFoods}
      />

      <EditFoodModal
        modalId={EDIT_MODAL_ID}
        food={selectedFood}
        onUpdated={loadFoods}
      />
    </div>
  );
}