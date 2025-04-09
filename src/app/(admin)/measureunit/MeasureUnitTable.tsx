"use client";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { MeasureUnit } from "@/services/measureUnitService";
import { formatDate } from "@/utils/dateHelper";

interface MeasureUnitTableProps {
  units: MeasureUnit[];
  onEdit?: (unit: MeasureUnit) => void;
  onDelete?: (id: string) => void;
}

export default function MeasureUnitTable({ 
  units, 
  onEdit, 
  onDelete 
}: MeasureUnitTableProps) {
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
                  Created At
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300">
                  Updated At
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {units.map((unit) => (
                <TableRow key={unit._id} className="dark:hover:bg-white/[0.03]">
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-white/90">
                    {unit.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                    {formatDate(unit.createdAt)}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                    {formatDate(unit.updatedAt)}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(unit)}
                          className="text-blue-500 hover:text-blue-700 dark:text-brand-300 dark:hover:text-brand-400"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(unit._id)}
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