import React from 'react';
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils/dateUtils";
import { formatRupiah } from '@/utils/formatUtils';

interface SPKItem {
  item: {
    _id: string;
    description: string;
    itemCode: string;
  };
  rateCode: string;
  estQty: {
    quantity: {
      nr: number; // Non-Remote Quantity
      r: number;  // Remote Quantity
    }
  }
}

interface SPKData {
  _id: string;
  spkNo: string;
  spkTitle: string;
  projectStartDate: string;
  projectEndDate: string;
  items: SPKItem[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  totalAmount: number; // Add this field

}

interface ViewSPKModalProps {
  isOpen: boolean;
  onClose: () => void;
  spkData: SPKData | null;
}

export default function ViewSPKModal({ isOpen, onClose, spkData }: ViewSPKModalProps) {
  if (!spkData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="max-w-[800px] p-5 dark:bg-black bg-white">
        <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
          SPK Details
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5">
          {/* Basic Info Section */}
          <div className="col-span-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">SPK Number</h5>
                <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">{spkData.spkNo}</p>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h5>
                <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${spkData.status === 'completed' ? 'bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-400' :
                    spkData.status === 'in-progress' ? 'bg-warning-50 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                    {(spkData.status || 'pending').replace('-', ' ').charAt(0).toUpperCase() +
                      (spkData.status || 'pending').replace('-', ' ').slice(1)}
                  </span>
                </p>
              </div>


              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Project Title</h5>               
                 <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                  {spkData.spkTitle}
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</h5>
                <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                  {formatRupiah(spkData.totalAmount)}
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</h5>
                <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                  {formatDate(new Date(spkData.projectStartDate))}
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</h5>
                <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                  {formatDate(new Date(spkData.projectEndDate))}
                </p>
              </div>

              {spkData.createdAt && (
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Update At</h5>
                  <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                    {formatDate(new Date(spkData.updatedAt || ''))}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Items Section */}
          <div className="col-span-1 mt-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-300">Items</h5>

            {spkData.items && spkData.items.length > 0 ? (
              <div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                      <TableRow>
                        <TableCell isHeader className="py-2 px-3 text-xs dark:text-gray-300">Item</TableCell>
                        <TableCell isHeader className="py-2 px-3 text-xs dark:text-gray-300">Rate Code</TableCell>
                        <TableCell isHeader className="py-2 px-3 text-xs dark:text-gray-300">Remote Qty</TableCell>
                        <TableCell isHeader className="py-2 px-3 text-xs dark:text-gray-300">Non-Remote Qty</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="dark:bg-gray-900">
                      {spkData.items.map((item, index) => (
                        <TableRow key={index} className="dark:border-gray-700">
                          <TableCell className="py-2 px-3 dark:text-gray-300">
                            {item.item ? ( // Check if item.item exists
                              <>
                                {item.item.description}
                                {item.item.itemCode && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({item.item.itemCode})</span>}
                              </>
                            ) : (
                              <span className="text-red-500 italic">Item has been deleted</span> // Display fallback text
                            )}
                          </TableCell>
                          <TableCell className="py-2 px-3 dark:text-gray-300">{item.rateCode}</TableCell>
                          <TableCell className="py-2 px-3 dark:text-gray-300">
                            {item.estQty.quantity.r}
                          </TableCell>
                          <TableCell className="py-2 px-3 dark:text-gray-300">
                            {item.estQty.quantity.nr}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm border rounded-md p-4 text-center border-dashed border-gray-300 dark:border-gray-600">
                No items added to this SPK.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-8">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}