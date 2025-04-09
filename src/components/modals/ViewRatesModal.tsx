import React from 'react';
import { Modal } from '../ui/modal';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";

interface ViewRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onAddRate: () => void;
  onEditRate: (rate: any) => void;
}

export default function ViewRatesModal({ isOpen, onClose, item, onAddRate, onEditRate }: ViewRatesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[600px] p-6 bg-white dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Rates for {item.itemCode} - {item.description}
        </h2>
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
          <Table>
            <TableHeader className="border-b border-gray-200 dark:border-gray-700">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 text-start">
                  Rate Code
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 text-start">
                  Status
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 text-start">
                  Non-Remote Rate
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 text-start">
                  Remote Rate
                </TableCell>
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 text-start">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {item.rates && item.rates.length > 0 ? (
                item.rates.map((rate: any, index: number) => (
                  <TableRow key={rate._id || `rate-${index}`}>
                    <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {rate.rateCode}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rate.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {rate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {rate.nonRemoteAreas}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {rate.remoteAreas}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      <button
                        onClick={() => onEditRate(rate)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell  className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">
                    No rates available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between">
          <button
            onClick={onAddRate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add New Rate
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}