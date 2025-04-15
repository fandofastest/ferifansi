import { formatRupiah } from "@/utils/formatUtils";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

interface ProfitLossProps {
  salesSummary: { [week: string]: number };
  costSummary: { [week: string]: number };
}

export function ProfitLossSummary({ salesSummary, costSummary }: ProfitLossProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Profit/Loss Summary</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader className="text-center text-gray-800 dark:text-gray-200">Category</TableCell>
            <TableCell isHeader className="text-center text-gray-800 dark:text-gray-200">Total Amount</TableCell>
            {Object.keys(salesSummary).map((week) => (
              <TableCell key={week} isHeader className="text-center text-gray-800 dark:text-gray-200">{week}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-gray-800 dark:text-gray-200">Total Sales</TableCell>
            <TableCell className="font-medium text-gray-800 dark:text-gray-200">{formatRupiah(Object.values(salesSummary).reduce((a, b) => a + b, 0))}</TableCell>
            {Object.keys(salesSummary).map(week => (
              <TableCell key={week} className="font-medium text-gray-800 dark:text-gray-200">{formatRupiah(salesSummary[week])}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-gray-800 dark:text-gray-200">Total Costs</TableCell>
            <TableCell className="font-medium text-gray-800 dark:text-gray-200">{formatRupiah(Object.values(costSummary).reduce((a, b) => a + b, 0))}</TableCell>
            {Object.keys(costSummary).map(week => (
              <TableCell key={week} className="font-medium text-gray-800 dark:text-gray-200">{formatRupiah(costSummary[week])}</TableCell>
            ))}
          </TableRow>
          <TableRow className="font-semibold">
            <TableCell className="font-medium text-gray-800 dark:text-gray-200">Profit/Loss</TableCell>
            <TableCell className={`font-medium ${
              Object.values(salesSummary).reduce((a, b) => a + b, 0) - 
              Object.values(costSummary).reduce((a, b) => a + b, 0) > 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatRupiah(
                Object.values(salesSummary).reduce((a, b) => a + b, 0) - 
                Object.values(costSummary).reduce((a, b) => a + b, 0)
              )}
            </TableCell>
            {Object.keys(salesSummary).map(week => (
              <TableCell key={week} className={`font-medium ${
                salesSummary[week] - costSummary[week] > 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatRupiah(salesSummary[week] - costSummary[week])}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}