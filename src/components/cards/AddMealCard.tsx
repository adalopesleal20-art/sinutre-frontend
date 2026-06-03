import { MEAL_CATEGORIES } from '@/constants/mealCategories';
import type { MealCategory } from '@/types/meal';
import { MealActionButton } from '../meals/MealActionButton';

interface AddMealCardProps {
  onSelectCategory: (category: MealCategory) => void;
}

export function AddMealCard({ onSelectCategory }: AddMealCardProps) {
  return (
    <article className="card bg-base-100 shadow-sm hidden lg:flex">
      <div className="card-body">
        <h2 className="card-title text-base-content/80 text-sm mb-4">
          Incluir refeição
        </h2>

        <div className="grid auto-rows-fr gap-4 h-full [grid-template-columns:repeat(auto-fit,minmax(130px,1fr))]">
          {MEAL_CATEGORIES.map(category => (
            <MealActionButton
              key={category.id}
              label={category.label}
              Icon={category.Icon}
              onClick={() => onSelectCategory(category.id)}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
