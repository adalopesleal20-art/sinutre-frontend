import { DotsThree } from '@phosphor-icons/react';
import { MEAL_CATEGORY_BY_ID } from '@/constants/mealCategories';
import type { Meal } from '@/types/meal';

interface MealsTableRowProps {
  meal: Meal;
  onActionClick?: (meal: Meal) => void;
}

export function MealsTableRow({ meal, onActionClick }: MealsTableRowProps) {
  const category = MEAL_CATEGORY_BY_ID[meal.category];

  return (
    <tr className="hover">
      <td className="text-center font-bold text-base-content/60">{meal.id}</td>
      <td className="font-medium">{meal.date}</td>
      <td className="font-semibold">{category.label}</td>
      <td>
        <span className="badge badge-primary badge-outline">
          {meal.calories} kcal
        </span>
      </td>
      <td className="text-center">
        <button
          type="button"
          onClick={() => onActionClick?.(meal)}
          className="btn btn-sm btn-ghost btn-square"
          aria-label="Mais ações"
        >
          <DotsThree size={20} />
        </button>
      </td>
    </tr>
  );
}
