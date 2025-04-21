"use client";
import { useEffect, useState } from "react";
import solarPriceService, { SolarPrice } from "@/services/solarPriceService";
import Button from "@/components/ui/button/Button";

interface SolarPriceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  onSuccess: () => void;
  initialData?: SolarPrice;
}

export default function SolarPriceFormModal({
  isOpen,
  onClose,
  mode,
  onSuccess,
  initialData,
}: SolarPriceFormModalProps) {
  const [price, setPrice] = useState<number>(0);
  const [effectiveDate, setEffectiveDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setPrice(initialData.price);
      setEffectiveDate(initialData.effectiveDate ? initialData.effectiveDate.slice(0, 10) : "");
    } else {
      setPrice(0);
      setEffectiveDate("");
    }
    setError(null);
  }, [mode, initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!price || !effectiveDate) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }
      if (mode === "edit" && initialData) {
        await solarPriceService.update(initialData._id, { price, effectiveDate });
      } else {
        await solarPriceService.create({ price, effectiveDate });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to save data.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {mode === "edit" ? "Edit Solar Price" : "Create Solar Price"}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200" htmlFor="price">
              Price (per liter)
            </label>
            <input
              id="price"
              type="number"
              className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
              value={price}
              min={0}
              onChange={e => setPrice(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200" htmlFor="effectiveDate">
              Effective Date
            </label>
            <input
              id="effectiveDate"
              type="date"
              className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
              value={effectiveDate}
              onChange={e => setEffectiveDate(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : mode === "edit" ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}