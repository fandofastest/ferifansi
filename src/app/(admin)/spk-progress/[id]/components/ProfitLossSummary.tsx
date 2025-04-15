import { formatRupiah } from "@/utils/formatUtils";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

interface ProfitLossProps {
  salesSummary: { [week: string]: number };
  costSummary: { [week: string]: number };
}

export function ProfitLossSummary({ salesSummary, costSummary }: ProfitLossProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Profit/Loss Summary</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Category</TableCell>
            <TableCell isHeader>Total Amount</TableCell>
            {Object.keys(salesSummary).map((week) => (
              <TableCell key={week} isHeader>{week}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Total Sales</TableCell>
            <TableCell>{formatRupiah(Object.values(salesSummary).reduce((a, b) => a + b, 0))}</TableCell>
            {Object.keys(salesSummary).map(week => (
              <TableCell key={week}>{formatRupiah(salesSummary[week])}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Total Costs</TableCell>
            <TableCell>{formatRupiah(Object.values(costSummary).reduce((a, b) => a + b, 0))}</TableCell>
            {Object.keys(costSummary).map(week => (
              <TableCell key={week}>{formatRupiah(costSummary[week])}</TableCell>
            ))}
          </TableRow>
          <TableRow className={`font-semibold ${
            Object.values(salesSummary).reduce((a, b) => a + b, 0) - 
            Object.values(costSummary).reduce((a, b) => a + b, 0) > 0 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            <TableCell>Profit/Loss</TableCell>
            <TableCell>
              {formatRupiah(
                Object.values(salesSummary).reduce((a, b) => a + b, 0) - 
                Object.values(costSummary).reduce((a, b) => a + b, 0)
              )}
            </TableCell>
            {Object.keys(salesSummary).map(week => (
              <TableCell key={week}>
                {formatRupiah(salesSummary[week] - costSummary[week])}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}