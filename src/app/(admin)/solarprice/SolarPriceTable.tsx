"use client";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { SolarPrice } from "@/services/solarPriceService";
import { formatDate } from "@/utils/dateHelper";
import { formatRupiah } from "@/utils/formatUtils";

interface SolarPriceTableProps {
  prices: SolarPrice[];
  onEdit?: (price: SolarPrice) => void;
  onDelete?: (id: string) => void;
}

export default function SolarPriceTable({
  prices,
  onEdit,
  onDelete
}: SolarPriceTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300">
                  Price
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300">
                  Effective Date
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {prices.map((price) => (
                <TableRow key={price._id} className="dark:hover:bg-white/[0.03]">
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-white/90">
                    {formatRupiah(price.price)}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                    {formatDate(price.effectiveDate)}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(price)}
                          className="text-blue-500 hover:text-blue-700 dark:text-brand-300 dark:hover:text-brand-400"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(price._id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}