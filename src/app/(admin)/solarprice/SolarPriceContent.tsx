"use client";
import { useState, useEffect } from "react";
import solarPriceService, { SolarPrice } from "@/services/solarPriceService";
import Button from "@/components/ui/button/Button";
import SolarPriceTable from "./SolarPriceTable";
import SolarPriceDeleteModal from "./SolarPriceDeleteModal";
import SolarPriceFormModal from "./SolarPriceFormModal";

export default function SolarPriceContent() {
  const [prices, setPrices] = useState<SolarPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<SolarPrice | null>(null);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const data = await solarPriceService.getAll();
      setPrices(data);
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (price: SolarPrice) => {
    setSelectedPrice(price);
    setIsEditModalOpen(true);
  };

  const handleDelete = (priceId: string) => {
    setSelectedPrice(prices.find(p => p._id === priceId) || null);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      {/* Create New Price Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Solar Price Management
        </div>
        <div className="space-x-2">
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Price
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : (
          <SolarPriceTable
            prices={prices}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modals */}
      <SolarPriceFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSuccess={fetchPrices}
      />

      <SolarPriceFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        initialData={selectedPrice || undefined}
        onSuccess={fetchPrices}
      />

      <SolarPriceDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        priceId={selectedPrice?._id || ''}
        onSuccess={fetchPrices}
      />
    </div>
  );
}