"use client";
import { useState } from "react";
import solarPriceService from "@/services/solarPriceService";
import Button from "@/components/ui/button/Button";

interface SolarPriceDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceId: string;
  onSuccess: () => void;
}

export default function SolarPriceDeleteModal({
  isOpen,
  onClose,
  priceId,
  onSuccess,
}: SolarPriceDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!priceId) return;
    setLoading(true);
    try {
      await solarPriceService.delete(priceId);
      onSuccess();
      onClose();
    } catch (error) {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Delete Solar Price
        </div>
        <div className="py-4 text-gray-700 dark:text-gray-200">
          Are you sure you want to delete this solar price record?
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}