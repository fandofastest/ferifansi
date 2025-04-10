"use client";
import { MeasureUnit, MeasureUnitData } from "@/services/measureUnitService";
import measureUnitService from "@/services/measureUnitService";
import { Modal } from "../ui/modal";
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Button from "../ui/button/Button";

interface MeasureUnitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: MeasureUnit;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

export default function MeasureUnitFormModal({
  isOpen,
  onClose,
  initialData,
  mode,
  onSuccess
}: MeasureUnitFormModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MeasureUnitData>();

  // Reset form when opening modal or initialData changes
  useEffect(() => {
    reset(initialData || { code: '', name: '' });
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: MeasureUnitData) => {
    try {
      if (mode === 'create') {
        await measureUnitService.create(data);
      } else if (initialData?._id) {
        await measureUnitService.update(initialData._id, data);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} unit:`, error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] p-6 bg-white dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {mode === 'create' ? 'Create New Unit' : 'Edit Unit'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Code
            </label>
            <input
              {...register('code', { required: 'Code is required' })}
              className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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
              {mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}