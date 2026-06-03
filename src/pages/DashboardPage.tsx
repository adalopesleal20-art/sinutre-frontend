import { AddMealCard } from '@/components/cards/AddMealCard';
import { TotalMealsCard } from '@/components/cards/TotalMealsCard';
import { Header } from '@/components/layout/Header';
import { MacroStatsBar } from '@/components/macros/MacroStatsBar';
import { MealFab } from '@/components/meals/MealFab';
import { MealsList } from '@/components/meals/MealsList';
import { MealsTable } from '@/components/meals/MealsTable';
import { AddMealModal } from '@/components/modal/AddMealModal';
import {
  CURRENT_USER,
  MACRO_SUMMARY,
  MEALS_SUMMARY,
  RECENT_MEALS,
  SAMPLE_MEAL_ITEMS,
} from '@/data/mockData';
import { useMealModal } from '@/hooks/useMealModal';

interface DashboardPageProps {
  drawerId: string;
}

const MODAL_MACROS = {
  carbs: 0,
  proteins: 0,
  fats: 0,
  calories: 0,
};

export function DashboardPage({ drawerId }: DashboardPageProps) {
  const modal = useMealModal();

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto mb-8">
        <Header
          drawerId={drawerId}
          userName={CURRENT_USER.name}
          avatarUrl={CURRENT_USER.avatarUrl}
        />

        <MacroStatsBar summary={MACRO_SUMMARY} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
          <TotalMealsCard summary={MEALS_SUMMARY} />
          <AddMealCard onSelectCategory={modal.openWith} />
        </div>

        <MealsTable meals={RECENT_MEALS} />
        <MealsList meals={RECENT_MEALS} />
      </div>

      <MealFab onSelectCategory={modal.openWith} />

      <AddMealModal
        open={modal.open}
        macros={MODAL_MACROS}
        items={SAMPLE_MEAL_ITEMS}
        onClose={modal.close}
        onSave={modal.close}
      />
    </>
  );
}
