import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Spreadsheet from 'react-spreadsheet';

const ExcelToSpreadsheet = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setData(sheetData.map((row) => row.map((cell) => ({ value: cell }))));
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />
      {data.length > 0 && <Spreadsheet data={data} />}
    </div>
  );
};

export default ExcelToSpreadsheet;
