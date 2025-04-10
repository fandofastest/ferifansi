"use client";
import { Modal } from "../ui/modal";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { ItemCost } from "@/services/itemCostService";
import measureUnitService, { MeasureUnit } from "@/services/measureUnitService";
import Button from "../ui/button/Button";

interface ItemCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ItemCost;
  onSubmit: (data: Partial<ItemCost>) => Promise<void>;
}

export default function ItemCostModal({
  isOpen,
  onClose,
  initialData,
  onSubmit
}: ItemCostModalProps) {
  const { register, handleSubmit, reset, control, watch, formState: { errors }, setValue } = useForm<Partial<ItemCost>>({
    defaultValues: initialData || { nama: '', costPerMonth: 0, costPerHour: 0, kategori: 'manpower' }
  });



  // Remove the useEffect hooks for automatic calculation

  const handleMonthBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const monthlyValue = parseFloat(e.target.value);
    if (!isNaN(monthlyValue)) {
      const calculatedHourly = monthlyValue / (22 * 8);
      setValue('costPerHour', calculatedHourly);
    }
  };

  const handleHourBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const hourlyValue = parseFloat(e.target.value);
    if (!isNaN(hourlyValue)) {
      const calculatedMonthly = hourlyValue * (22 * 8);
      setValue('costPerMonth', calculatedMonthly);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details.manpowerDetails.overtime"
  });

  const selectedCategory = watch('kategori');
  const [measureUnits, setMeasureUnits] = useState<MeasureUnit[]>([]);

  useEffect(() => {
    reset(initialData || { nama: '', costPerMonth: 0, costPerHour: 0, kategori: 'manpower' });
  }, [isOpen, initialData, reset]);

  useEffect(() => {
    const fetchMeasureUnits = async () => {
      try {
        const units = await measureUnitService.getAll();
        setMeasureUnits(units);
      } catch (error) {
        console.error("Error fetching measure units:", error);
      }
    };
    fetchMeasureUnits();
  }, []);

  const handleFormSubmit = async (data: Partial<ItemCost>) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] p-6 bg-white dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {initialData ? 'Edit Item Cost' : 'Create New Item Cost'}
        </h2>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              {...register('nama', { required: 'Name is required' })}
              className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.nama && (
              <p className="text-red-500 text-sm mt-1">{errors.nama.message}</p>
            )}
          </div>

          {selectedCategory && !['material', 'security'].includes(selectedCategory) && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cost Per Month
                </label>
                <input
                  type="number"
                  {...register('costPerMonth', { required: 'Cost per month is required' })}
                  onBlur={handleMonthBlur}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {errors.costPerMonth && (
                  <p className="text-red-500 text-sm mt-1">{errors.costPerMonth.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cost Per Hour
                </label>
                <input
                  type="number"
                  {...register('costPerHour', { required: 'Cost per hour is required' })}
                  onBlur={handleHourBlur}
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {errors.costPerHour && (
                  <p className="text-red-500 text-sm mt-1">{errors.costPerHour.message}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              {...register('kategori', { required: 'Category is required' })}
              className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="manpower">Manpower</option>
              <option value="equipment">Equipment</option>
              <option value="material">Material</option>
              <option value="security">Security</option>
            </select>
            {errors.kategori && (
              <p className="text-red-500 text-sm mt-1">{errors.kategori.message}</p>
            )}
          </div>

          {/* Conditional fields based on selected category */}
          {selectedCategory === 'manpower' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Overtime Details
              </label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex space-x-2 mb-2">
                  <input
                    {...register(`details.manpowerDetails.overtime.${index}.hari` as const, { required: 'Day is required' })}
                    placeholder="Day"
                    className="w-1/2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="number"
                    {...register(`details.manpowerDetails.overtime.${index}.overtimeRate` as const, { required: 'Overtime rate is required' })}
                    placeholder="Overtime Rate"
                    className="w-1/2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <button type="button" onClick={() => remove(index)} className="text-red-500">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => append({ hari: '', overtimeRate: 0, _id: Date.now().toString() })} className="text-brand-500 hover:text-brand-600">Add Overtime</button>
            </div>
          )}

          {selectedCategory === 'equipment' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fuel Consumption Per Hour
              </label>
              <input
                type="number"
                {...register('details.equipmentDetails.fuelConsumptionPerHour')}
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GPS Cost Per Day
              </label>
              <input
                type="number"
                {...register('details.equipmentDetails.gpsCostPerDay')}
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}

          {selectedCategory === 'material' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Material Unit
              </label>
              <select
                {...register('details.materialDetails.materialUnit')}
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {measureUnits.map(unit => (
                  <option key={unit._id} value={unit._id}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Per Unit
              </label>
              <input
                type="number"
                {...register('details.materialDetails.pricePerUnit')}
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}

          {selectedCategory === 'security' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Daily Cost
              </label>
              <input
                type="number"
                {...register('details.securityDetails.dailyCost')}
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg "
            >
              {initialData ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}