import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import rateService, { Rate } from '@/services/rateService';
import AddRateCodeModal from './AddRateCodeModal';
import Button from '../ui/button/Button';
import { Switch } from '@/components/ui/switch/Switch';

interface RateModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  onSuccess?: () => void;  // Add this prop
}

export default function RateModal({ isOpen, onClose, itemId, onSuccess }: RateModalProps) {
  const [rates, setRates] = useState<Rate[]>([]);
  const [showAddRateModal, setShowAddRateModal] = useState(false);
  const [isActive, setIsActive] = useState(true); // Add active state

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await rateService.getAll();
      setRates(response);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const selectedRateCode = formData.get('rateCode') as string;
    const selectedRate = rates.find(rate => rate.rateCode === selectedRateCode);
  
    if (!selectedRate || !itemId) {
      alert('Please select a rate code');
      return;
    }
  
    try {
      await rateService.addItemRate(itemId, {
        rateCode: selectedRateCode,
        nonRemoteAreas: Number(formData.get('nonRemoteAreas')),
        remoteAreas: Number(formData.get('remoteAreas')),
        isActive // Add isActive to the payload
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating rate:', error);
      alert('Failed to add rate. Please try again.');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-[400px] p-6 bg-white dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Add Rate</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rate Code
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddRateModal(true)}
                  className="text-sm text-brand-500 hover:text-brand-600 dark:hover:text-brand-600"
                >
                  + Add New Rate Code
                </button>
              </div>
              <select
                name="rateCode"
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select a rate code</option>
                {rates.map((rate) => (
                  <option key={rate._id} value={rate.rateCode}>
                    {rate.rateCode} ({new Date(rate.effectiveDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Non Remote Areas Rate</label>
              <input
                type="number"
                name="nonRemoteAreas"
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remote Areas Rate</label>
              <input
                type="number"
                name="remoteAreas"
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status: {isActive ? 'Active' : 'Inactive'}
              </label>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                variant={isActive ? 'primary' : 'default'}
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
                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg "
              >
                Create
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      {showAddRateModal && (
        <AddRateCodeModal
          isOpen={showAddRateModal}
          onClose={() => setShowAddRateModal(false)}
          onSuccess={() => {
            fetchRates();
            setShowAddRateModal(false);
          }}
        />
      )}
    </>
  );
}