"use client";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ItemCost } from "@/services/itemCostService";

interface ItemCostTableProps {
  items: ItemCost[];
  onEdit?: (item: ItemCost) => void;
  onDelete?: (id: string) => void;
}

export default function ItemCostTable({ 
  items, 
  onEdit, 
  onDelete 
}: ItemCostTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300">
                  Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300">
                  Cost Per Month
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300">
                  Cost Per Hour
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300">
                  Category
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {items.map((item) => (
                <TableRow key={item._id} className="dark:hover:bg-white/[0.03]">
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-white/90">
                    {item.nama}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                    {item.costPerMonth}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                    {item.costPerHour}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                    {item.kategori}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(item)}
                          className="text-blue-500 hover:text-blue-700 dark:text-brand-300 dark:hover:text-brand-400"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(item._id)}
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