import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import rateService from '@/services/rateService';
import Button from '../ui/button/Button';

interface AddRateCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddRateCodeModal({ isOpen, onClose, onSuccess }: AddRateCodeModalProps) {
  const [rateCode, setRateCode] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await rateService.create({
        rateCode,
        effectiveDate,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating rate code:', error);
      alert('Failed to create rate code');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] p-6 bg-white dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Rate Code</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rate Code
            </label>
            <input
              type="text"
              value={rateCode}
              onChange={(e) => setRateCode(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Effective Date
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
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
              className="px-3 py-1.5  text-white rounded-lg  "
            >
              Create Rate Code
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}