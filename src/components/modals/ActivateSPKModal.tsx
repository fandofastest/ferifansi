import React from 'react';
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

interface ActivateSPKModalProps {
  isOpen: boolean;
  onClose: () => void;
  spkNo: string;
  onConfirm: () => void;
}

export default function ActivateSPKModal({ isOpen, onClose, spkNo, onConfirm }: ActivateSPKModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-6 bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activate SPK</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          SPK <span className="font-medium">{spkNo}</span> has been created successfully. 
          Would you like to activate it now?
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Not now
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
          >
            Activate SPK
          </Button>
        </div>
      </div>
    </Modal>
  );
}