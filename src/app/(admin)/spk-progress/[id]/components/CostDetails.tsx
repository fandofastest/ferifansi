import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { formatRupiah } from "@/utils/formatUtils";
import { SPKProgress } from "@/services/spkProgressService";
import React, { useEffect, useState } from "react";

interface CategorySummary {
  manpower: number;
  equipment: number;
  fuel: number;
  security: number;
  consumable: number;
}

interface WeeklySummary {
  [week: string]: CategorySummary;
}

interface CostDetailsProps {
  progressData: SPKProgress[];
  onSummary: (costs: { [week: string]: number }) => void;
}

export function CostDetails({ progressData, onSummary }: CostDetailsProps) {
  const [costSummary, setCostSummary] = useState<WeeklySummary>({});

  // Move the handler outside useEffect
  useEffect(() => {
    calculateCostSummary(progressData);
  }, [progressData]);

  // Add this useEffect with proper memoization
  const memoizedTotals = React.useMemo(() => {
    return Object.entries(costSummary).reduce((acc, [week, categories]) => ({
      ...acc,
      [week]: Object.values(categories).reduce((sum, amount) => sum + amount, 0)
    }), {});
  }, [costSummary]);

  useEffect(() => {
    onSummary(memoizedTotals);
  }, [memoizedTotals, onSummary]);

  const calculateCostSummary = (data: SPKProgress[]) => {
    const costs: WeeklySummary = {};
    const totalWeeks = Math.ceil(
      (new Date(data[0].spk.projectEndDate).getTime() - new Date(data[0].spk.projectStartDate).getTime()) 
      / (7 * 24 * 60 * 60 * 1000)
    );
    
    for (let i = 1; i <= totalWeeks; i++) {
      costs[`W${i}`] = { manpower: 0, equipment: 0, fuel: 0, security: 0, consumable: 0 };
    }

    data.forEach(progress => {
      const weekKey = `W${Math.floor(
        (new Date(progress.timeDetails?.startTime || progress.progressDate).getTime() - 
        new Date(progress.spk.projectStartDate).getTime()) / (7 * 24 * 60 * 60 * 1000)
      ) + 1}`;

      if (!costs[weekKey]) return;

      progress.costUsed?.forEach(cost => {
        const category = cost.itemCost.kategori;
        if (category === 'equipment' && cost.details.equipment) {
          costs[weekKey].equipment += cost.details.equipment.jumlahUnit * 
            cost.details.equipment.jamKerja * 
            cost.details.equipment.costPerHour;
          
          costs[weekKey].fuel += cost.details.equipment.fuelUsage * 
            cost.details.equipment.fuelPrice;
        } else {
          const mappedCategory = category === 'material' ? 'consumable' : 
            (category as keyof CategorySummary);
          costs[weekKey][mappedCategory] += cost.totalCost;
        }
      });
    });

    setCostSummary(costs);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Cost Summary</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Category</TableCell>
            <TableCell isHeader>Total Amount</TableCell>
            {Object.keys(costSummary).map((week) => (
              <TableCell key={week} isHeader>{week}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Categories */}
          {Object.entries({
            Manpower: 'manpower',
            Equipment: 'equipment',
            Fuel: 'fuel',
            Security: 'security',
            'Consumable & Other': 'consumable'
          }).map(([label, key]) => (
            <TableRow key={key}>
              <TableCell>{label}</TableCell>
              <TableCell>
                {formatRupiah(
                  Object.values(costSummary).reduce((sum, week) => sum + week[key as keyof CategorySummary], 0)
                )}
              </TableCell>
              {Object.keys(costSummary).map(week => (
                <TableCell key={week}>
                  {formatRupiah(costSummary[week][key as keyof CategorySummary])}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {/* Weekly Totals Row */}
          <TableRow className="bg-gray-100 font-semibold">
            <TableCell>Weekly Total</TableCell>
            <TableCell>
              {formatRupiah(
                Object.values(costSummary).reduce((sum, week) => 
                  sum + Object.values(week).reduce((weekSum, amount) => weekSum + amount, 0)
                , 0)
              )}
            </TableCell>
            {Object.keys(costSummary).map(week => (
              <TableCell key={week}>
                {formatRupiah(
                  Object.values(costSummary[week]).reduce((sum, amount) => sum + amount, 0)
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}