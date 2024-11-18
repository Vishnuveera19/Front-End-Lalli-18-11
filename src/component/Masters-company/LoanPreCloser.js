import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const LoanPreclosure = () => {
  // Sample data for the Loan_PreCloser table fields
  const [loans, setLoans] = useState([
    {
      pn_CompanyID: 101,
      pn_BranchID: 202,
      pn_EmployeeID: 303,
      loan_appid: 12345,
      d_date: '2024-01-01',
      n_loanamount: 50000,
      n_balanceamount: 20000,
      n_paidamount: 30000,
      n_closureamount: 20000,
      n_checkno: 'CHK001',
      d_checkdate: '2024-01-15',
      n_checkamount: 20000,
      v_bankname: 'ABC Bank',
      v_Remarks: 'Loan preclosure due to retirement',
      c_status: 'O',
      int_amt: 1500,
      payment_mode: 'Cheque',
      loan_process: 'Completed',
      loan_interest: 5,
      loan_name: 'Home Loan'
    }
    // Add more rows as needed
  ]);

  // Function to handle loan preclosure
  const handlePreclose = (loan_appid) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.loan_appid === loan_appid ? { ...loan, c_status: 'C' } : loan
      )
    );
    alert(`Loan with ID ${loan_appid} has been preclosed.`);
  };

  // Define columns to match the Loan_PreCloser table structure
  const columns = [
    { field: 'pn_CompanyID', headerName: 'Company ID', width: 120 },
    { field: 'pn_BranchID', headerName: 'Branch ID', width: 120 },
    { field: 'pn_EmployeeID', headerName: 'Employee ID', width: 130 },
    { field: 'loan_appid', headerName: 'Loan App ID', width: 130 },
    {
      field: 'd_date',
      headerName: 'Date',
      width: 130,
      type: 'date',
      valueGetter: (params) => new Date(params.value), // Convert string to Date
    },
    { field: 'n_loanamount', headerName: 'Loan Amount', width: 130, type: 'number' },
    { field: 'n_balanceamount', headerName: 'Balance Amount', width: 150, type: 'number' },
    { field: 'n_paidamount', headerName: 'Paid Amount', width: 130, type: 'number' },
    { field: 'n_closureamount', headerName: 'Closure Amount', width: 150, type: 'number' },
    { field: 'n_checkno', headerName: 'Check No', width: 120 },
    {
      field: 'd_checkdate',
      headerName: 'Check Date',
      width: 130,
      type: 'date',
      valueGetter: (params) => new Date(params.value), // Convert string to Date
    },
    { field: 'n_checkamount', headerName: 'Check Amount', width: 130, type: 'number' },
    { field: 'v_bankname', headerName: 'Bank Name', width: 130 },
    { field: 'v_Remarks', headerName: 'Remarks', width: 150 },
    { field: 'c_status', headerName: 'Status', width: 100 },
    { field: 'int_amt', headerName: 'Interest Amount', width: 130, type: 'number' },
    { field: 'payment_mode', headerName: 'Payment Mode', width: 150 },
    { field: 'loan_process', headerName: 'Process Status', width: 150 },
    { field: 'loan_interest', headerName: 'Loan Interest', width: 130, type: 'number' },
    { field: 'loan_name', headerName: 'Loan Name', width: 130 },
    {
      field: 'preclose',
      headerName: 'Preclose',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePreclose(params.row.loan_appid)}
          disabled={params.row.c_status === 'C'} // Disable if already preclosed
        >
          Preclose
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <h2>Loan Preclosure</h2>
      <DataGrid
        rows={loans}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        getRowId={(row) => row.loan_appid} // Use loan_appid as unique row id
      />
    </div>
  );
};

export default LoanPreclosure;
