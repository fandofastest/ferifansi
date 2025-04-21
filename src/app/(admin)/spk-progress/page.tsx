"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { formatDate } from '@/utils/dateHelper';
import { formatRupiah } from "@/utils/formatUtils";
import Button from "@/components/ui/button/Button";
import spkProgressService, { SPKProgress, SPKProgressItem } from "@/services/spkProgressService";

export default function SPKProgressPage() {
  const [progressData, setProgressData] = useState<SPKProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const data = await spkProgressService.getAll();
        setProgressData(data);
      } catch (error) {
        console.error('Error fetching SPK progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = progressData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(progressData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const calculateTotalAmount = (items: SPKProgressItem[]) => {
    return items.reduce((total, item) => total + item.workQty.amount, 0);
  };

  return (
    <div>
      <div className="rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            SPK Progress
          </div>
          <div className="space-x-2">
 
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="border-b border-gray-200 dark:border-gray-700">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-700 dark:text-gray-300 text-start text-theme-xs">
                      SPK Number
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Project Title
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Progress Date
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Mandor
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Total Amount
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <TableRow>
                      <TableCell  className="px-5 py-10 text-center">
                        <span className="flex justify-center">
                          Loading...
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((progress) => (
                      <TableRow key={progress._id}>
                        <TableCell className="px-5 py-4 text-gray-700 dark:text-gray-300">
                          <div className="font-medium">{progress.spk?.spkNo || 'N/A'}</div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                          {progress.spk?.spkNo || 'N/A'}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                          {progress.spk?.spkTitle || 'N/A'}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                          {formatDate(progress.progressDate)}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                          {progress.mandor?.name || 'No Mandor Assigned'}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                          {formatRupiah(calculateTotalAmount(progress.progressItems))}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                          <div className="flex space-x-2">
                           
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell  className="px-5 py-10 text-center">
                        <span className="flex justify-center">
                          No progress data found
                        </span>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {progressData.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}