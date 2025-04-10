"use client";

import React, { useState, useEffect } from "react";
import ItemCostModal from "@/components/modals/ItemCostModal";
import itemCostService from "@/services/itemCostService";
import { ItemCost } from "@/services/itemCostService";
import ItemCostTable from "./ItemCostTable";
import Button from "@/components/ui/button/Button";

export default function ItemCostContent() {
  const [items, setItems] = useState<ItemCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemCost | undefined>(undefined); // Change type to ItemCost | undefined

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemCostService.getAll();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedItem(undefined); // Use undefined instead of null
    setIsModalOpen(true);
  };

  const handleEdit = (item: ItemCost) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await itemCostService.delete(id);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Item Cost Management
        </div>
        <div className="space-x-2">
          <Button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create New Item
          </Button>
        </div>
      </div>

      <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : (
          <ItemCostTable
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <ItemCostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          if (selectedItem) {
            await itemCostService.update(selectedItem._id, data);
          } else {
            await itemCostService.create(data);
          }
          fetchItems();
        }}
        initialData={selectedItem}
      />
    </div>
  );
}