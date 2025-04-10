"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/tables/Pagination";
import ItemModal from "@/components/modals/ItemModal";
import itemService from '@/services/itemService';
import rateService, { Rate } from '@/services/rateService';
import { Modal } from "@/components/ui/modal";

// Add import
import EditItemModal from "@/components/modals/EditItemModal";
import RateModal from "@/components/modals/RateModal";
import ViewRatesModal from "@/components/modals/ViewRatesModal";
import Button from "@/components/ui/button/Button";

export default function UnitRatePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedRateIndex, setSelectedRateIndex] = useState<number | null>(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isViewRatesModalOpen, setIsViewRatesModalOpen] = useState(false); // Add this line
  const itemsPerPage = 10;

  const fetchItems = async () => {
    try {
      const response = await itemService.getAll();
      setItems(response);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Get current items for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const handleCreateUnitRate = async (formData: any) => {
    try {
      const response = await itemService.create(formData);
      console.log('Unit rate created:', response);
      setIsModalOpen(false);
      return response;
    } catch (error) {
      console.error('Error creating unit rate:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this rate?')) {
      try {
        await itemService.delete(id);
        fetchItems();
      } catch (error) {
        console.error('Error deleting rate:', error);
      }
    }
  };

  return (
    <div>
      <div className="rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Item and Rate Management
          </div>
          <div className="space-x-2">
            
            <Button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create New Item
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="border-b border-gray-200 dark:border-gray-700">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 text-start text-theme-xs">
                      Item Code
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Description
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Unit
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Category
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Sub Category
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Rates
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.map((item) => (
                    <TableRow key={item.itemCode}>
                      <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-300">
                        {item.itemCode}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        {item.description}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        {item.unitMeasurement}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        {item.category?.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        {item.subCategory?.name || '-'}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        {item.rates?.length > 0 ? (
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsViewRatesModalOpen(true);
                            }}
                            className="text-green-500 hover:text-green-600"
                          >
                            {item.rates?.length} rates (View)
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsRateModalOpen(true);
                            }}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            Add Rate
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEditModalOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-600 mr-2"
                        >
                          Edit
                        </button>
                        <span className="mx-2">|</span>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-600 ml-2"
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </div>
        </div>
      </div>

      <ItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUnitRate}
        onRateSuccess={fetchItems}
      />

      {selectedItem && (
        <EditItemModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          onSuccess={fetchItems}
          item={selectedItem}
        />
      )}
      
      {selectedItem && (
        <RateModal
          isOpen={isRateModalOpen}
          onClose={() => {
            setIsRateModalOpen(false);
            setSelectedItem(null);
          }}
          itemId={selectedItem._id}
          onSuccess={fetchItems}
        />
      )}
      
      {selectedItem && (
        <ViewRatesModal
          isOpen={isViewRatesModalOpen}
          onClose={() => {
            setIsViewRatesModalOpen(false);
            setSelectedItem(null);
          }}
          onSuccess={fetchItems}
          item={selectedItem}
          onAddRate={() => {
            setIsRateModalOpen(true);
            setIsViewRatesModalOpen(false);
          }}
          onEditRate={(rate) => {
            setSelectedRate(rate);
            setIsRateModalOpen(true);
            setIsViewRatesModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
