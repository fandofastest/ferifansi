import React from 'react';
import { Modal } from '../ui/modal';
import { toast } from 'react-toastify';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function CategoryModal({ isOpen, onClose, onSubmit }: CategoryModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
     toast.success('Category created successfully');
    onSubmit({
      name: formData.get('name'),
      description: formData.get('description'),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] p-6 bg-white dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Create New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}