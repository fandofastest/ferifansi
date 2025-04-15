"use client";

import React, { useEffect, useState, use } from "react";
import { formatDate } from '@/utils/dateHelper';
import spkProgressService, { SPKProgress } from "@/services/spkProgressService";
import { SalesDetails } from "./components/SalesDetails";
import { CostDetails } from "./components/CostDetails";
import { ProfitLossSummary } from "./components/ProfitLossSummary";
import { formatRupiah } from "@/utils/formatUtils";
import { exportToExcel } from '@/utils/excelHelper';

export default function SPKDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [progressData, setProgressData] = useState<SPKProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklySales, setWeeklySales] = useState<{ [week: string]: number }>({});
  const [weeklyCosts, setWeeklyCosts] = useState<{ [week: string]: number }>({});

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const data = await spkProgressService.getProgressBySpkId(resolvedParams.id);
        setProgressData(data);
      } catch (error) {
        console.error('Error fetching SPK progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [resolvedParams.id]);

  const handleSalesSummary = React.useCallback((sales: { [week: string]: number }) => {
      setWeeklySales(sales);
    }, []);
  
    const handleCostSummary = React.useCallback((costs: { [week: string]: number }) => {
      setWeeklyCosts(costs);
    }, []);

  if (loading) return <div>Loading...</div>;
  if (!progressData.length) return <div>No progress data found</div>;

  const spkInfo = progressData[0].spk;

  const handleExportExcel = () => {
    const combinedSheet = [
      // Project Info Section
      ['Project Information'],
      ['SPK No', spkInfo.spkNo],
      ['Project Title', spkInfo.spkTitle],
      ['Location', spkInfo.location.name],
      ['Total Contract Value', formatRupiah(spkInfo.totalAmount)],
      ['Project Duration', `${formatDate(spkInfo.projectStartDate)} - ${formatDate(spkInfo.projectEndDate)}`],
      ['Total Days', Math.ceil((new Date(spkInfo.projectEndDate).getTime() - 
        new Date(spkInfo.projectStartDate).getTime()) / (1000 * 60 * 60 * 24))],
      [''], // Empty row for spacing

      // Sales Details Section
      ['Sales Details'],
      ['Description', 'Total Amount', ...Object.keys(weeklySales).map(week => week)],
      ...Array.from(new Set(progressData.flatMap(p => 
        p.progressItems.map(item => item.spkItemSnapshot.description)
      ))).map(desc => [
        desc,
        formatRupiah(progressData.reduce((sum, p) => 
          sum + p.progressItems
            .filter(item => item.spkItemSnapshot.description === desc)
            .reduce((itemSum, item) => itemSum + item.workQty.amount, 0), 0
        )),
        ...Object.keys(weeklySales).map(week => 
          formatRupiah(progressData
            .filter(p => `W${Math.floor((new Date(p.timeDetails?.startTime || p.progressDate).getTime() - 
              new Date(p.spk.projectStartDate).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}` === week)
            .reduce((sum, p) => sum + p.progressItems
              .filter(item => item.spkItemSnapshot.description === desc)
              .reduce((itemSum, item) => itemSum + item.workQty.amount, 0), 0)
          )
        )
      ]),
      [''], // Empty row for spacing

      // Cost Details Section
      ['Cost Details'],
      ['Category', 'Total Amount', ...Object.keys(weeklyCosts).map(week => week)],
      ...Object.entries({
        'Manpower': 'manpower',
        'Equipment': 'equipment',
        'Fuel': 'fuel',
        'Security': 'security',
        'Consumable & Other': 'consumable'
      }).map(([label, category]) => [
        label,
        formatRupiah(Object.values(weeklyCosts).reduce((sum, weekTotal) => sum + weekTotal, 0)),
        ...Object.keys(weeklyCosts).map(week => formatRupiah(weeklyCosts[week]))
      ]),
      [''], // Empty row for spacing

      // Profit/Loss Summary Section
      ['Profit/Loss Summary'],
      ['Category', 'Total Amount', ...Object.keys(weeklySales).map(week => week)],
      ['Total Sales', formatRupiah(Object.values(weeklySales).reduce((a, b) => a + b, 0)), 
        ...Object.keys(weeklySales).map(week => formatRupiah(weeklySales[week]))],
      ['Total Costs', formatRupiah(Object.values(weeklyCosts).reduce((a, b) => a + b, 0)), 
        ...Object.keys(weeklyCosts).map(week => formatRupiah(weeklyCosts[week]))],
      ['Profit/Loss', 
        formatRupiah(Object.values(weeklySales).reduce((a, b) => a + b, 0) - 
          Object.values(weeklyCosts).reduce((a, b) => a + b, 0)),
        ...Object.keys(weeklySales).map(week => 
          formatRupiah(weeklySales[week] - weeklyCosts[week])
        )
      ]
    ];

    const workbook = {
      'SPK Summary': combinedSheet
    };

    exportToExcel(workbook, `SPK_${spkInfo.spkNo.replace(/[:\\/?*\[\]]/g, '_')}_Summary`);
  };

  return (
    <div className="space-y-6">
      {/* SPK Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{spkInfo.spkNo}</h1>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Export to Excel
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Project Title</p>
              <p className="font-medium">{spkInfo.spkTitle}</p>
            </div>
            <div>
              <p className="text-gray-600">Location</p>
              <p className="font-medium">{spkInfo.location.name}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Total Contract Value</p>
              <p className="font-medium text-lg">{formatRupiah(spkInfo.totalAmount)}</p>
            </div>
            <div>
              <p className="text-gray-600">Project Duration</p>
              <p className="font-medium">
                {formatDate(spkInfo.projectStartDate)} - {formatDate(spkInfo.projectEndDate)}
                <span className="ml-2 text-gray-500">
                  ({Math.ceil((new Date(spkInfo.projectEndDate).getTime() - 
                    new Date(spkInfo.projectStartDate).getTime()) / 
                    (1000 * 60 * 60 * 24))} days)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Tables */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow overflow-x-auto space-y-6">
        <SalesDetails progressData={progressData} onSummary={handleSalesSummary} />
        <CostDetails progressData={progressData} onSummary={handleCostSummary} />
        <ProfitLossSummary salesSummary={weeklySales} costSummary={weeklyCosts} />
      </div>
    </div>
  );
}