import { FormField } from '../forms/FormField';

export function MealItemForm() {
  return (
    <div className="grid gap-4 items-end lg:[grid-template-columns:1fr_150px_120px]">
      <FormField label="Alimento" htmlFor="item-name">
        <input
          id="item-name"
          type="text"
          placeholder="Ex: arroz branco"
          className="input input-bordered w-full"
        />
      </FormField>

      <FormField label="Gramas" htmlFor="item-grams">
        <input
          id="item-grams"
          type="number"
          placeholder="100"
          className="input input-bordered w-full"
        />
      </FormField>

      <button type="button" className="btn btn-primary btn-outline h-12">
        Adicionar
      </button>
    </div>
  );
}
