"use client";
import measureUnitService from "@/services/measureUnitService";
import { Modal } from "../ui/modal";

interface MeasureUnitDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: string;
  onSuccess: () => void;
}

export default function MeasureUnitDeleteModal({
  isOpen,
  onClose,
  unitId,
  onSuccess
}: MeasureUnitDeleteModalProps) {
  const handleDelete = async () => {
    try {
      await measureUnitService.delete(unitId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] p-6 bg-white dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Delete Unit
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete this unit? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}