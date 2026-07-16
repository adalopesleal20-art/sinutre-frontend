import { useEffect, useState } from 'react';

import { updateFood } from '@/services/foodService';
import type { Food } from '@/types/food';

interface EditFoodModalProps {
  modalId: string;
  food: Food | null;
  onUpdated: () => Promise<void> | void;
}

export function EditFoodModal({
  modalId,
  food,
  onUpdated,
}: EditFoodModalProps) {
  const [name, setName] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] =
    useState('');
  const [carbsPer100g, setCarbsPer100g] =
    useState('');
  const [proteinPer100g, setProteinPer100g] =
    useState('');
  const [fatPer100g, setFatPer100g] =
    useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!food) {
      return;
    }

    setName(food.name);
    setCaloriesPer100g(
      String(food.caloriesPer100g),
    );
    setCarbsPer100g(
      String(food.carbsPer100g),
    );
    setProteinPer100g(
      String(food.proteinPer100g),
    );
    setFatPer100g(
      String(food.fatPer100g),
    );
  }, [food]);

  async function handleSave() {
    if (!food) {
      return;
    }

    try {
      setLoading(true);

      await updateFood(food.id, {
        name,
        caloriesPer100g: Number(
          caloriesPer100g,
        ),
        carbsPer100g: Number(
          carbsPer100g,
        ),
        proteinPer100g: Number(
          proteinPer100g,
        ),
        fatPer100g: Number(
          fatPer100g,
        ),
      });

      await onUpdated();

      (
        document.getElementById(
          modalId,
        ) as HTMLDialogElement
      )?.close();
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          Editar alimento
        </h3>

        <div className="space-y-3 mt-4">
          <input
            className="input input-bordered w-full"
            placeholder="Nome"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Calorias por 100g"
            value={caloriesPer100g}
            onChange={(event) =>
              setCaloriesPer100g(
                event.target.value,
              )
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Carboidratos por 100g"
            value={carbsPer100g}
            onChange={(event) =>
              setCarbsPer100g(
                event.target.value,
              )
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Proteínas por 100g"
            value={proteinPer100g}
            onChange={(event) =>
              setProteinPer100g(
                event.target.value,
              )
            }
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Gorduras por 100g"
            value={fatPer100g}
            onChange={(event) =>
              setFatPer100g(
                event.target.value,
              )
            }
          />
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">
              Cancelar
            </button>
          </form>

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={handleSave}
          >
            {loading
              ? 'Salvando...'
              : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </dialog>
  );
}