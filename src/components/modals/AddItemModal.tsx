import React, { useState } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Item } from '@/services/itemService';
import Input from "@/components/form/input/InputField";
import { toast } from 'react-toastify';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onAddItem: (item: Item) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onAddItem 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredItems = searchTerm 
    ? items.filter(item => 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.itemCode && item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : items;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium dark:text-white">Select Item</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search items..."
              className="pl-10"
              defaultValue={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto border rounded-md dark:border-gray-700">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800 sticky top-0">
              <TableRow>
                <TableCell isHeader className="py-2 px-3 text-xs dark:text-gray-300">Name</TableCell>
                <TableCell isHeader className="py-2 px-3 text-xs dark:text-gray-300">Rate Code</TableCell>
                <TableCell isHeader className="py-2 px-3 text-xs w-30 dark:text-gray-300">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="dark:bg-gray-900">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  // Find first active rate
                  const activeRate = item.rates?.find(rate => rate.isActive);
                  return (
                    <TableRow key={item._id} className="dark:border-gray-700">
                      <TableCell className="py-2 px-3 dark:text-gray-300">{item.description}</TableCell>
                      <TableCell className="py-2 px-3 dark:text-gray-300">
                        {activeRate ? activeRate.rateCode : 'No active rates'}
                      </TableCell>
                      <TableCell className="py-2 px-3">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            if (activeRate) {
                              onAddItem(item);
                              onClose(); 
                            }
                            else {
                              toast.error('Item has no active rates. Please add active rates first.');
                            }
                          }}
                        >
                          {activeRate ? "Add" : "No active rates"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell  className="py-10 text-center dark:text-gray-400  ">
                    {searchTerm ? 'No matching items found' : 'No items available. Please create items first.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;