import React, { useState, useEffect } from 'react';
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import spkService, { SPK } from '@/services/spkService';
import itemService, { Item as ServiceItem } from '@/services/itemService';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AddItemModal from './AddItemModal';

interface SPKModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (spk: SPK) => void; // Updated to pass the SPK object
}

// Define the item structure
interface Item {
  _id: string;
  name: string;
  rateCode: string;
}

// Define the structure for SPK items
interface SPKItem {
  item: string; // Item ID
  rateCode: string;
  estQty: {
    quantity: {
      nr: number; // Non-Remote Quantity
      r: number;  // Remote Quantity
    }
  }
}

// Update the component to use the correct Item interface
export default function SPKModal({ isOpen, onClose, onSuccess }: SPKModalProps) {
  const [formData, setFormData] = useState({
    spkNo: '',
    spkTitle: '',
    projectStartDate: null as Date | null,
    projectEndDate: null as Date | null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [spkItems, setSpkItems] = useState<SPKItem[]>([]);
  const [showItemSelector, setShowItemSelector] = useState(false);
  
  // Fetch available items when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen]);
  
  const fetchItems = async () => {
    try {
      const response = await itemService.getAll();
      setItems(response);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartDateChange = (selectedDates: Date[], dateStr: string) => {
    setFormData(prev => ({
      ...prev,
      projectStartDate: selectedDates[0] || null
    }));
  };

  const handleEndDateChange = (selectedDates: Date[], dateStr: string) => {
    setFormData(prev => ({
      ...prev,
      projectEndDate: selectedDates[0] || null
    }));
  };
  
  const handleAddItem = (item: ServiceItem) => {
    // Find the first active rate
    const activeRate = item.rates?.find(rate => rate.isActive);
    const rateCode = activeRate ? activeRate.rateCode : '';
    
    const newItem: SPKItem = {
      item: item._id,
      rateCode: rateCode,
      estQty: {
        quantity: {
          nr: 0,
          r: 0
        }
      }
    };
    
    setSpkItems([...spkItems, newItem]);
    setShowItemSelector(false);
  };
  
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...spkItems];
    updatedItems.splice(index, 1);
    setSpkItems(updatedItems);
  };
  
  const handleItemQuantityChange = (index: number, type: 'nr' | 'r', value: number) => {
    const updatedItems = [...spkItems];
    updatedItems[index].estQty.quantity[type] = value;
    setSpkItems(updatedItems);
  };

  const resetForm = () => {
    setFormData({
      spkNo: '',
      spkTitle: '',
      projectStartDate: null,
      projectEndDate: null
    });
    setSpkItems([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.spkNo || !formData.spkTitle || !formData.projectStartDate || !formData.projectEndDate) {
      alert('Please fill all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Format the request according to your API structure
      const spkData = {
        spkNo: formData.spkNo,
        spkTitle: formData.spkTitle,
        projectStartDate: formData.projectStartDate?.toISOString(),
        projectEndDate: formData.projectEndDate?.toISOString(),
        items: spkItems
      };
      
      const response=await spkService.create(spkData);
      resetForm();
      onSuccess(response); // Pass the created SPK back
      onClose();
    } catch (error) {
      console.error('Error creating SPK:', error);
      alert('Failed to create SPK. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Find item name by ID
  // Update the getItemName function to work with the ServiceItem type
  const getItemName = (itemId: string) => {
    const item = items.find(i => i._id === itemId);
    return item ? item.description : 'Unknown Item';
  };

  // Add these new state variables for search
  

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
    >
      <div className="max-w-[800px] p-5 dark:bg-black bg-white">
        <form onSubmit={handleSubmit}>
          <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
            Create New SPK
          </h4>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-5">
            <div className="col-span-1">
              <Label>SPK Number</Label>
              <Input
                type="text"
                name="spkNo"
                placeholder="SPK/2024/001"
                defaultValue={formData.spkNo}
                onChange={handleChange}
              />
            </div>
            
            <div className="col-span-1">
              <Label>Project Title</Label>
              <Input
                type="text"
                name="spkTitle"
                placeholder="Enter project title"
                defaultValue={formData.spkTitle}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div className="col-span-1">
                <DatePicker
                  id="projectStartDate"
                  label="Start Date"
                  onChange={handleStartDateChange}
                  defaultDate={formData.projectStartDate || undefined}
                  placeholder="Select start date"
                />
              </div>
              
              <div className="col-span-1">
                <DatePicker
                  id="projectEndDate"
                  label="End Date"
                  onChange={handleEndDateChange}
                  defaultDate={formData.projectEndDate || undefined}
                  placeholder="Select end date"
                />
              </div>
            </div>
            
            <div className="col-span-1 mt-3">
              <div className="flex justify-between items-center mb-2">
                <Label>Items</Label>
                <Button
                type='button' 
                  size="sm" 
                  onClick={() => setShowItemSelector(true)}
                  startIcon={<PlusIcon className="h-4 w-4" />}
                >
                  Add Item
                </Button>
              </div>
              
              {spkItems.length > 0 ? (
                <div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                        <TableRow>
                          <TableCell isHeader className="py-2 px-3 text-xs dark:text-gray-300">Item</TableCell>
                          <TableCell isHeader className="py-2 px-3 text-xs dark:text-gray-300">Rate Code</TableCell>
                          <TableCell isHeader className="py-2 px-3 text-xs dark:text-gray-300">Remote Qty</TableCell>
                          <TableCell isHeader className="py-2 px-3 text-xs dark:text-gray-300">Non-Remote Qty</TableCell>
                          <TableCell isHeader className="py-2 px-3 text-xs w-10 dark:text-gray-300">Action</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="dark:bg-gray-900">
                        {spkItems.map((item, index) => (
                          <TableRow key={index} className="dark:border-gray-700">
                            <TableCell className="py-2 px-3 dark:text-gray-300">{getItemName(item.item)}</TableCell>
                            <TableCell className="py-2 px-3 dark:text-gray-300">{item.rateCode}</TableCell>
                            <TableCell className="py-2 px-3">
                              <Input
                                type="number"
                                defaultValue={item.estQty.quantity.r}
                                onChange={(e) => handleItemQuantityChange(index, 'r', Number(e.target.value))}
                                min="0"
                                className="max-w-[80px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                              />
                            </TableCell>
                            <TableCell className="py-2 px-3">
                              <Input
                                type="number"
                                defaultValue={item.estQty.quantity.nr}
                                onChange={(e) => handleItemQuantityChange(index, 'nr', Number(e.target.value))}
                                min="0"
                                className="max-w-[80px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                              />
                            </TableCell>
                            <TableCell className="py-2 px-3">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm border rounded-md p-4 text-center border-dashed border-gray-300 dark:border-gray-600">
                  No items added. Click "Add Item" to add items to this SPK.
                </div>
              )}
              
              {showItemSelector && (
               <AddItemModal
               isOpen={showItemSelector}
               onClose={() => setShowItemSelector(false)}
               items={items}
               onAddItem={handleAddItem}
             />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create SPK'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
   
  );
}