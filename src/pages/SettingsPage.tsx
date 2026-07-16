import { useEffect, useState } from 'react';

import {
  getHealthData,
  saveHealthData,
} from '@/services/healthService';

export function SettingsPage() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [targetDietDaily, setTargetDietDaily] =
    useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getHealthData();

        if (data.height) {
          setHeight(String(data.height));
        }

        if (data.weight) {
          setWeight(String(data.weight));
        }

        if (data.targetDietDaily) {
          setTargetDietDaily(
            String(data.targetDietDaily),
          );
        }
      } catch {}
    }

    load();
  }, []);

  async function handleSave() {
    try {
      setLoading(true);

      await saveHealthData({
        height: Number(height),
        weight: Number(weight),
        targetDietDaily: Number(
          targetDietDaily,
        ),
        levelActivity: 'SEDENTARIO',
      });

      window.alert(
        'Dados salvos com sucesso!',
      );
    } catch {
      window.alert(
        'Erro ao salvar os dados.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Configurações
      </h1>

      <div className="space-y-4">

        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Altura (m)"
          value={height}
          onChange={(e) =>
            setHeight(e.target.value)
          }
        />

        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Peso (kg)"
          value={weight}
          onChange={(e) =>
            setWeight(e.target.value)
          }
        />

        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Meta calórica diária"
          value={targetDietDaily}
          onChange={(e) =>
            setTargetDietDaily(
              e.target.value,
            )
          }
        />

        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading
            ? 'Salvando...'
            : 'Salvar'}
        </button>

      </div>
    </div>
  );
}