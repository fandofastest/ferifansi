"use client";
import { useState, useEffect } from "react";
import MeasureUnitFormModal from "@/components/modals/MeasureUnitFormModal";
import MeasureUnitDeleteModal from "@/components/modals/MeasureUnitDeleteModal";
import measureUnitService, { MeasureUnit } from "@/services/measureUnitService";
import Button from "@/components/ui/button/Button";
import MeasureUnitTable from "./MeasureUnitTable";

export default function MeasureUnitContent() {
  const [units, setUnits] = useState<MeasureUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<MeasureUnit | null>(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const data = await measureUnitService.getAll();
      setUnits(data);
    } catch (error) {
      console.error("Error fetching units:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (unit: MeasureUnit) => {
    setSelectedUnit(unit);
    setIsEditModalOpen(true);
  };

  const handleDelete = (unitId: string) => {
    setSelectedUnit(units.find(u => u._id === unitId) || null);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      {/* Create New Unit Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Measure Unit Management
        </div>
        <div className="space-x-2">
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Unit
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : (
          <MeasureUnitTable 
            units={units}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modals */}
      <MeasureUnitFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSuccess={fetchUnits}
      />

      <MeasureUnitFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        initialData={selectedUnit || undefined}
        onSuccess={fetchUnits}
      />

      <MeasureUnitDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        unitId={selectedUnit?._id || ''}
        onSuccess={fetchUnits}
      />
    </div>
  );
}