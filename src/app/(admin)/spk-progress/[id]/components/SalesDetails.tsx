import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { formatRupiah } from "@/utils/formatUtils";
import { SPKProgress } from "@/services/spkProgressService";
import React, { useEffect, useState } from "react";

interface ProgressSummary {
  description: string;
  amount: number;
}

interface WeeklySales {
  [week: string]: ProgressSummary[];
}

interface SalesDetailsProps {
  progressData: SPKProgress[];
  onSummary: (sales: { [week: string]: number }) => void;
}

export function SalesDetails({ progressData, onSummary }: SalesDetailsProps) {
  const [salesSummary, setSalesSummary] = useState<WeeklySales>({});

  useEffect(() => {
    calculateSalesSummary(progressData);
  }, [progressData]);

  // Add this useEffect with proper memoization
  const memoizedSummary = React.useMemo(() => {
    return Object.entries(salesSummary).reduce((acc, [week, items]) => ({
      ...acc,
      [week]: items.reduce((sum, item) => sum + item.amount, 0)
    }), {});
  }, [salesSummary]);

  useEffect(() => {
    onSummary(memoizedSummary);
  }, [memoizedSummary, onSummary]);

  const calculateSalesSummary = (data: SPKProgress[]) => {
    const sales: WeeklySales = {};
    const totalWeeks = Math.ceil(
      (new Date(data[0].spk.projectEndDate).getTime() - new Date(data[0].spk.projectStartDate).getTime()) 
      / (7 * 24 * 60 * 60 * 1000)
    );
    
    for (let i = 1; i <= totalWeeks; i++) {
      sales[`W${i}`] = [];
    }

    data.forEach(progress => {
      const weekKey = `W${Math.floor(
        (new Date(progress.timeDetails?.startTime || progress.progressDate).getTime() - 
        new Date(progress.spk.projectStartDate).getTime()) / (7 * 24 * 60 * 60 * 1000)
      ) + 1}`;

      if (!sales[weekKey]) return;

      progress.progressItems.forEach(item => {
        sales[weekKey].push({
          description: item.spkItemSnapshot.description,
          amount: item.workQty.amount
        });
      });
    });

    setSalesSummary(sales);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Progress Items Summary</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Description</TableCell>
            <TableCell isHeader>Total Amount</TableCell>
            {Object.keys(salesSummary).map((week) => (
              <TableCell key={week} isHeader>{week}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Items */}
          {Array.from(new Set(Object.values(salesSummary).flat().map(item => item.description))).map(desc => (
            <TableRow key={desc}>
              <TableCell>{desc}</TableCell>
              <TableCell>
                {formatRupiah(
                  Object.values(salesSummary)
                    .flat()
                    .filter(item => item.description === desc)
                    .reduce((sum, item) => sum + item.amount, 0)
                )}
              </TableCell>
              {Object.keys(salesSummary).map(week => (
                <TableCell key={week}>
                  {formatRupiah(
                    salesSummary[week]
                      .filter(item => item.description === desc)
                      .reduce((sum, item) => sum + item.amount, 0)
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {/* Weekly Totals Row */}
          <TableRow className="bg-gray-100 font-semibold">
            <TableCell>Weekly Total</TableCell>
            <TableCell>
              {formatRupiah(
                Object.values(salesSummary)
                  .flat()
                  .reduce((sum, item) => sum + item.amount, 0)
              )}
            </TableCell>
            {Object.entries(salesSummary).map(([week, items]) => (
              <TableCell key={week}>
                {formatRupiah(items.reduce((sum, item) => sum + item.amount, 0))}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}