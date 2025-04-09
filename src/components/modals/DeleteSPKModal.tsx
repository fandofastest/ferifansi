import React from 'react';
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";

interface DeleteSPKModalProps {
  isOpen: boolean;
  onClose: () => void;
  spkNo: string;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteSPKModal({ 
  isOpen, 
  onClose, 
  spkNo,
  onConfirm,
  isLoading
}: DeleteSPKModalProps) {
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="max-w-[500px] p-5 dark:bg-black bg-white">
        <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
          Cancel SPK
        </h4>
        
        <Alert
          variant="warning"
          title="Confirmation Required"
          message="Are you sure you want to cancel this SPK? This action will mark the SPK as cancelled."
          showLink={false}
        />
        
        <div className="mt-5 mb-3 text-gray-600 dark:text-gray-300">
          <p>SPK Number: <span className="font-medium">{spkNo}</span></p>
        </div>
        
        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onClose}
          >
            No, Keep It
          </Button>
          <button
          onClick={onConfirm}
          className="px-4 py-3 text-sm font-medium text-white rounded-lg bg-error-500 shadow-theme-xs hover:bg-error-600"
        >
          Ok Confirm
        </button>
        </div>
      </div>
    </Modal>
  );
}