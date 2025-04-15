import * as XLSX from 'xlsx';

export const exportToExcel = (data: { [sheet: string]: any[] }, fileName: string) => {
  const wb = XLSX.utils.book_new();
  
  // Create each sheet
  Object.entries(data).forEach(([sheetName, sheetData]) => {
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  // Save the file
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};