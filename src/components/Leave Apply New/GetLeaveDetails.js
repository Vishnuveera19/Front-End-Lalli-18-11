import React, { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import { postRequest } from '../../serverconfiguration/requestcomp';
import { ServerConfig } from '../../serverconfiguration/serverconfig';
import { REPORTS } from '../../serverconfiguration/controllers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Navbar from "../Home Page/Navbar";
import Sidenav from "../Home Page/Sidenav";
const LeaveDetails = () => {
  const [branch, setBranch] = useState([]);
  const [pnBranchId, setPnBranchId] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [rowData, setRowData] = useState([]);
  const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem('user'));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [employee, setEmployee] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setSelectedYear(date.getFullYear());
      setSelectedMonth(date.getMonth() + 1);
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        const branchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `select * from paym_Branch where Branch_User_Id = '${isloggedin}'`,
        });
        setBranch(branchData.data);
        if (branchData.data.length > 0) {
          setPnBranchId(branchData.data[0].pn_BranchID);
        }
      } catch (error) {
        console.error('Error fetching branch data:', error);
      }
    }
    getData();
  }, [isloggedin]);

  useEffect(() => {
    async function getEmployeeData() {
      try {
        const employeeData = await postRequest(ServerConfig.url, REPORTS, {
          query: `select * from Paym_Employee where pn_BranchID = '${pnBranchId}'`,
        });
        setEmployee(employeeData.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    }
    if (pnBranchId) {
      getEmployeeData();
    }
  }, [pnBranchId]);

  const fetchLeaveDetails = async () => {
    if (selectedEmployee && selectedYear && selectedMonth) {
      try {
        const leaveData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * FROM leave_apply 
                  WHERE pn_EmployeeID = '${selectedEmployee}' 
                    AND YEAR(from_date) = '${selectedYear}' 
                    AND MONTH(from_date) = '${selectedMonth}'`,
        });
        setRowData(leaveData.data || []);
      } catch (error) {
        console.error('Error fetching leave data:', error);
      }
    }
  };

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditedRowData(row);
  };

  const handleSaveClick = async () => {
    try {
      await postRequest(ServerConfig.url, REPORTS, {
        query: `UPDATE leave_apply
                SET 
                  pn_Leavename = '${editedRowData.pn_Leavename}',
                  pn_leavecode = '${editedRowData.pn_leavecode}',
                  from_date = '${editedRowData.from_date}',
                  from_status = '${editedRowData.from_status}',
                  to_date = '${editedRowData.to_date}',
                  status = '${editedRowData.status}',
                  days = '${editedRowData.days}',
                  reason = '${editedRowData.reason}',
                  submitted_date = '${editedRowData.submitted_date}',
                  approve = '${editedRowData.approve}',
                  reminder = '${editedRowData.reminder}',
                  priority = '${editedRowData.priority}',
                  comments = '${editedRowData.comments}'
                WHERE id = '${editedRowData.id}'`
      });
      setRowData((prevRowData) =>
        prevRowData.map((row, index) =>
          index === editRowIndex ? editedRowData : row
        )
      );
      setEditRowIndex(null);
    } catch (error) {
      console.error('Error saving edited row data:', error);
    }
  };

  const handleChange = (e, fieldName) => {
    setEditedRowData({
      ...editedRowData,
      [fieldName]: e.target.value,
    });
  };

  return (
    
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Navbar /> {/* Navbar is now properly placed at the top */}
      
      <Grid container>
        <Grid item xs={2} sx={{ borderRight: 1 }}>
          <Sidenav /> {/* Sidebar on the left */}
        </Grid>

        <Grid item xs={10} sx={{ padding: 2, marginTop: '64px' }}>
          {/* Main content area */}
          <Grid item xs={12} style={{ textAlign: 'left', marginTop: '20px' }}>
  <Typography
    variant="h5"
    gutterBottom
    style={{
      borderBottom: '2px solid rgba(0, 0, 0, 0.12)', // hidden light underline for Leave Request
      paddingBottom: '8px', // padding below the text
    }}
  >
    Leave Details
  </Typography>
</Grid>

  <Grid container spacing={2} style={{ width: '100%' }} alignItems="center">
  {/* Employee Select Dropdown */}
  <Grid item xs={3} className="formField">
    <FormControl fullWidth>
      <InputLabel>Employee</InputLabel>
      <Select
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
      >
        <MenuItem value="">
          <em>Select Employee</em>
        </MenuItem>
        {employee.map((emp) => (
          <MenuItem key={emp.pn_EmployeeID} value={emp.pn_EmployeeID}>
            {emp.Employee_Full_Name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  {/* Date Picker for Year and Month */}
  <Grid item xs={4}>
    <DatePicker
      views={['year', 'month']}
      label="Select Year and Month"
      value={selectedDate}
      onChange={handleDateChange}
      renderInput={(params) => <TextField {...params} fullWidth />}
    />
  </Grid>

  {/* View Details Button */}
  <Grid item xs={2}>
    <Button
      variant="contained"
      color="success"
      onClick={fetchLeaveDetails}
      fullWidth
    >
      View Details
    </Button>
  </Grid>
</Grid>


<Grid item xs={12} style={{ textAlign: 'left', marginTop: '20px' }}>
  <Typography
    variant="h5"
    gutterBottom
    style={{
      borderBottom: '2px solid rgba(0, 0, 0, 0.12)', // hidden light underline for Leave Request
      paddingBottom: '8px', // padding below the text
    }}
  >
    Leave Request
  </Typography>
</Grid>
      {rowData.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Emp.Code</TableCell>
                <TableCell>Emp.Name</TableCell>
                <TableCell>Leave Name</TableCell>
                <TableCell>Leave Code</TableCell>
                <TableCell>From Date</TableCell>
                <TableCell>From Status</TableCell>
                <TableCell>To Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Submitted on</TableCell>
                <TableCell>Approve</TableCell>
                <TableCell>Remind on</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.Emp_code}</TableCell>
                  <TableCell>{row.Emp_name}</TableCell>
                  <TableCell>{row.pn_Leavename}</TableCell>
                  <TableCell>{row.pn_leavecode}</TableCell>
                  <TableCell>{new Date(row.from_date).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>{row.from_status}</TableCell>
                  <TableCell>{new Date(row.to_date).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.days}</TableCell>
                  <TableCell>{row.reason}</TableCell>
                  <TableCell>{new Date(row.submitted_date).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>{row.approve}</TableCell>
                  <TableCell>{new Date(row.reminder).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>{row.comments}</TableCell>
                  <TableCell>
                    {editRowIndex === index ? (
                      <Button onClick={handleSaveClick}>Save</Button>
                    ) : (
                      <Button onClick={() => handleEditClick(index, row)}>Edit</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default LeaveDetails;
