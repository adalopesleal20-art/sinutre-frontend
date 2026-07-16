import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { api } from '@/lib/api';

import {
  getHealthData,
  type HealthData,
} from '@/services/healthService';

import type { Meal } from '@/types/mealSummary';

export function ProgressPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [healthData, setHealthData] =
    useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const [mealsResponse, healthResponse] =
          await Promise.all([
            api.get<Meal[]>('/meals'),
            getHealthData(),
          ]);

        setMeals(mealsResponse.data);
        setHealthData(healthResponse);
      } catch {
        window.alert(
          'Não foi possível carregar os dados de progresso.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

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

  const lastSevenDaysData = useMemo(() => {
    const today = new Date();

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(today.getDate() - 6);

    const caloriesInPeriod = meals
      .filter((meal) => {
        const mealDate = new Date(meal.eatTime);

        return (
          mealDate >= startDate &&
          mealDate <= today
        );
      })
      .reduce(
        (total, meal) =>
          total + meal.totals.calories,
        0,
      );

    const average = caloriesInPeriod / 7;

    return {
      total: caloriesInPeriod,
      average,
    };
  }, [meals]);

  const calorieGoal =
    healthData?.targetDietDaily ?? 0;

  const averageDifference =
    lastSevenDaysData.average - calorieGoal;

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full min-h-[300px]">
        <span className="text-gray-500">
          Carregando...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Progresso
        </h1>

        <p className="text-base-content/70">
          Acompanhe suas métricas de saúde
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">
              Índice de Massa Corporal
            </h2>

            {imcData ? (
              <>
                <p className="text-4xl font-bold text-primary">
                  {imcData.value}
                </p>

                <p className="text-lg">
                  {imcData.classification}
                </p>

                <div className="divider" />

                <p>
                  Peso:{' '}
                  <strong>
                    {healthData?.weight} kg
                  </strong>
                </p>

                <p>
                  Altura:{' '}
                  <strong>
                    {healthData?.height} m
                  </strong>
                </p>
              </>
            ) : (
              <p>
                Cadastre seu peso e sua altura
                em Configurações.
              </p>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">
              Média calórica dos últimos 7 dias
            </h2>

            <p className="text-4xl font-bold text-primary">
              {Math.round(
                lastSevenDaysData.average,
              )}{' '}
              kcal
            </p>

            <p>
              Meta diária:{' '}
              <strong>
                {calorieGoal
                  ? `${calorieGoal} kcal`
                  : 'Não cadastrada'}
              </strong>
            </p>

            <p>
              Total consumido no período:{' '}
              <strong>
                {Math.round(
                  lastSevenDaysData.total,
                )}{' '}
                kcal
              </strong>
            </p>

            {calorieGoal > 0 && (
              <div
                className={`alert mt-4 ${
                  averageDifference > 0
                    ? 'alert-error'
                    : 'alert-success'
                }`}
              >
                <span>
                  {averageDifference > 0
                    ? `A média ficou ${Math.round(
                        averageDifference,
                      )} kcal acima da meta.`
                    : `A média ficou ${Math.round(
                        Math.abs(
                          averageDifference,
                        ),
                      )} kcal dentro da meta.`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}