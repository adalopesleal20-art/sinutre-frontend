import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AddMealCard } from '@/components/cards/AddMealCard';
import { TotalMealsCard } from '@/components/cards/TotalMealsCard';
import { Header } from '@/components/layout/Header';
import { MacroStatsBar } from '@/components/macros/MacroStatsBar';
import { MealFab } from '@/components/meals/MealFab';
import { MealsList } from '@/components/meals/MealsList';
import { MealsTable } from '@/components/meals/MealsTable';
import { AddMealModal } from '@/components/modal/AddMealModal';

import { useAuth } from '@/context/AuthContext';
import { useMealModal } from '@/hooks/useMealModal';

import { api } from '@/lib/api';

import {
  getHealthData,
  type HealthData,
} from '@/services/healthService';

import type { Meal } from '@/types/mealSummary';

interface DashboardPageProps {
  drawerId: string;
}

export function DashboardPage({
  drawerId,
}: DashboardPageProps) {
  const { user } = useAuth();
  const modal = useMealModal();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [healthData, setHealthData] =
    useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      const [mealsResponse, healthResponse] =
        await Promise.all([
          api.get<Meal[]>('/meals'),
          getHealthData(),
        ]);

      setMeals(mealsResponse.data);
      setHealthData(healthResponse);
    } finally {
      setLoading(false);
    }
  }

  async function loadMeals() {
    const response =
      await api.get<Meal[]>('/meals');

    setMeals(response.data);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const mealsSummary = useMemo(() => {
    const today = new Date();

    const total = meals.length;

    const todayCount = meals.filter(
      (meal) => {
        const date = new Date(meal.eatTime);

        return (
          date.getDate() ===
            today.getDate() &&
          date.getMonth() ===
            today.getMonth() &&
          date.getFullYear() ===
            today.getFullYear()
        );
      },
    ).length;

    const monthCount = meals.filter(
      (meal) => {
        const date = new Date(meal.eatTime);

        return (
          date.getMonth() ===
            today.getMonth() &&
          date.getFullYear() ===
            today.getFullYear()
        );
      },
    ).length;

    return {
      total,
      thisMonth: monthCount,
      today: todayCount,
    };
  }, [meals]);

  const macroSummary = useMemo(() => {
    const today = new Date();

    const totals = meals
      .filter((meal) => {
        const date = new Date(meal.eatTime);

        return (
          date.getDate() ===
            today.getDate() &&
          date.getMonth() ===
            today.getMonth() &&
          date.getFullYear() ===
            today.getFullYear()
        );
      })
      .reduce(
        (accumulator, meal) => {
          accumulator.carbs +=
            meal.totals.carbs;
          accumulator.proteins +=
            meal.totals.proteins;
          accumulator.fats +=
            meal.totals.fats;
          accumulator.calories +=
            meal.totals.calories;

          return accumulator;
        },
        {
          carbs: 0,
          proteins: 0,
          fats: 0,
          calories: 0,
        },
      );

    return {
      ...totals,
      caloriesGoal:
        healthData?.targetDietDaily ?? 0,
    };
  }, [meals, healthData]);

  const imcData = useMemo(() => {
    const height = healthData?.height;
    const weight = healthData?.weight;

    if (!height || !weight) {
      return null;
    }

    const imc = weight / (height * height);

    let classification = '';

    if (imc < 18.5) {
      classification = 'Abaixo do peso';
    } else if (imc < 25) {
      classification = 'Peso normal';
    } else if (imc < 30) {
      classification = 'Sobrepeso';
    } else if (imc < 35) {
      classification = 'Obesidade grau I';
    } else if (imc < 40) {
      classification = 'Obesidade grau II';
    } else {
      classification = 'Obesidade grau III';
    }

    return {
      value: imc.toFixed(2),
      classification,
    };
  }, [healthData]);

  const calorieGoalExceeded =
    macroSummary.caloriesGoal > 0 &&
    macroSummary.calories >
      macroSummary.caloriesGoal;

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-gray-500">
          Carregando...
        </span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto mb-8">
        <Header
          drawerId={drawerId}
          userName={user.name}
          avatarUrl={user.avatarUrl}
        />

        <MacroStatsBar
          summary={macroSummary}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">
                Meta calórica
              </h2>

              <p className="text-2xl font-bold">
                {healthData?.targetDietDaily
                  ? `${healthData.targetDietDaily} kcal`
                  : 'Não cadastrada'}
              </p>

              <p className="text-sm text-base-content/70">
                Consumido hoje:{' '}
                {Math.round(
                  macroSummary.calories,
                )}{' '}
                kcal
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">
                Peso e altura
              </h2>

              <p>
                Peso:{' '}
                <strong>
                  {healthData?.weight
                    ? `${healthData.weight} kg`
                    : 'Não cadastrado'}
                </strong>
              </p>

              <p>
                Altura:{' '}
                <strong>
                  {healthData?.height
                    ? `${healthData.height} m`
                    : 'Não cadastrada'}
                </strong>
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">
                IMC
              </h2>

              {imcData ? (
                <>
                  <p className="text-2xl font-bold">
                    {imcData.value}
                  </p>

                  <p className="text-sm">
                    {imcData.classification}
                  </p>
                </>
              ) : (
                <p>
                  Cadastre peso e altura.
                </p>
              )}
            </div>
          </div>
        </div>

        {calorieGoalExceeded && (
          <div
            role="alert"
            className="alert alert-error"
          >
            <span>
              Atenção: sua meta calórica
              diária foi ultrapassada!
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
          <TotalMealsCard
            summary={mealsSummary}
          />

          <AddMealCard
            onSelectCategory={
              modal.openWith
            }
          />
        </div>

        <MealsTable meals={meals} />
        <MealsList meals={meals} />
      </div>

      <MealFab
        onSelectCategory={modal.openWith}
      />

      <AddMealModal
        open={modal.open}
        typeMeal={modal.selectedCategory}
        onClose={modal.close}
        onSave={modal.close}
        onMealCreated={loadMeals}
      />
    </>
  );
}