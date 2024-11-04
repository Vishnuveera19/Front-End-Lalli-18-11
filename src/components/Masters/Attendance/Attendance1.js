import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,CardContent,Grid,Box,
  Paper,
  IconButton,
  InputBase,
  InputAdornment,
  Typography,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import nodata from '../../../images/NoDataImage.jpeg';
import { getRequest } from '../../../serverconfiguration/requestcomp';
import { ServerConfig } from '../../../serverconfiguration/serverconfig'; 
import { TIMECARD } from '../../../serverconfiguration/controllers';
import Sidenav from "../../Home Page/Sidenav";
import Navbar from "../../Home Page/Navbar";

export default function Attendance01() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTimeCardData();
        console.log('Data before setting state:', data);
        setRows(data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    const toLowerCaseSafe = (value) => (value ? value.toString().toLowerCase() : '');
    
    const matchesSearchTerm =
      toLowerCaseSafe(row.EmpCode).includes(searchTerm.toLowerCase()) ||
      toLowerCaseSafe(row.EmpName).includes(searchTerm.toLowerCase()) ||
      toLowerCaseSafe(row.Date).includes(searchTerm.toLowerCase()) ||
      toLowerCaseSafe(row.DayOfWeak).includes(searchTerm.toLowerCase()) ||
      toLowerCaseSafe(row.InTime).includes(searchTerm.toLowerCase()) ||
      toLowerCaseSafe(row.BreakOut).includes(searchTerm.toLowerCase()) ||
      toLowerCaseSafe(row.BreakIn).includes(searchTerm.toLowerCase()) ||
      toLowerCaseSafe(row.OutTime).includes(searchTerm.toLowerCase()) ||
      toLowerCaseSafe(row.OTHrs).includes(searchTerm.toLowerCase()) ||
      toLowerCaseSafe(row.Status).includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter =
      selectedStatus === '' || toLowerCaseSafe(row.Status) === selectedStatus.toLowerCase();
    
    return matchesSearchTerm && matchesStatusFilter;
  });
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'P':
        return 'Present';
      case 'A':
        return 'Absent';
      case 'O':
        return 'Half Day';
      default:
        return 'Unknown'; // Optional: in case of other or unexpected status values
    }
  };
  const fetchTimeCardData = async () => {
    try {
      const query = `
        SELECT 
          [empCode] as EmpCode,
          [empName] as EmpName,
          [dates] as Date,
          [days] as DayOfWeak,
          [intime] as InTime,
          [breakOut] as BreakOut,
          [breakIn] as BreakIn,
          [outtime] as OutTime,
          [otHrs] as OTHrs,
          [status] as Status,
          [shiftCode] as ShiftCode  -- Added Shift Code
        FROM 
          dbo.[time_card]
        ORDER BY 
          dates DESC
      `;
  
      console.log('Query:', query);
  
      const response = await getRequest(ServerConfig.url, TIMECARD, { query });
  
      console.log('Full API Response:', response);
  
      if (response.status === 200) {
        const data = response.data || [];
  
        console.log('Response Data:', data);
  
        if (Array.isArray(data)) {
          return data.map((item) => ({
            ID: item.empCode,
            EmpCode: item.empCode,
            EmpName: item.empName,
            Date: formatDate(new Date(item.dates)),
            DayOfWeak: item.days,
            InTime: formatTime(item.intime),
            BreakOut: formatTime(item.breakOut),
            BreakIn: formatTime(item.breakIn),
            OutTime: formatTime(item.outtime),
            OTHrs: formatTime(item.otHrs),
            Status: item.status,
            ShiftCode: item.shiftCode,  // Added Shift Code
          }));
        } else {
          console.error('Expected data to be an array but got:', data);
          return [];
        }
      } else {
        console.error(`Unexpected response status: ${response.status}`);
        return [];
      }
    } catch (error) {
      console.error('Error fetching timecard data:', error);
      return [];
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const dateObj = new Date(timeString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return dateObj.toLocaleTimeString([], options);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  return (
    <Grid item xs={12}>
      <div style={{ backgroundColor: "#fff" }}>
        <Navbar />
        <Box height={30} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Grid
            item
            xs={12}
            sm={10}
            md={9}
            lg={8}
            xl={7}
            style={{ marginLeft: "auto", marginRight: "auto", margin: "100px 50px 50px 50px" }}  
          >
            <div>
              <Typography variant="h6" align="center" mb={2}>
                Employee Records
              </Typography>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <div>
                  <Button variant="contained">Show 10 entries</Button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <InputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleSearchChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconButton aria-label="search" edge="start">
                          {/* SearchIcon */}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </div>
              </div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 950 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Emp Code</TableCell>
                      <TableCell align="left">Emp Name</TableCell>
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Day of Week</TableCell>
                      <TableCell align="center">In Time</TableCell>
                      <TableCell align="center">Break Out</TableCell>
                      <TableCell align="center">Break In</TableCell>
                      <TableCell align="center">Out Time</TableCell>
                      <TableCell align="center">OT Hrs</TableCell>
                      <TableCell align="center">Shift Code</TableCell> {/* Added Shift Code column */}
                      <TableCell align="center">
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            label="Status"
                            sx={{ '& .MuiSelect-select': { padding: '8px 16px' } }} // Adjust padding
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="P">Present</MenuItem> {/* Present (P) */}
                            <MenuItem value="A">Absent</MenuItem> {/* Absent (A) */}
                            <MenuItem value="O">Half Day</MenuItem> {/* Half Day (O) */}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
  {isLoading ? (
    <TableRow>
      <TableCell colSpan={13} align="center">
        <CircularProgress />
      </TableCell>
    </TableRow>
  ) : filteredRows.length === 0 ? (
    <TableRow>
      <TableCell colSpan={13} align="center">
        <IconButton>
          <img src={nodata} alt="No data" height="150" />
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          No records found.
        </Typography>
      </TableCell>
    </TableRow>
  ) : (
    filteredRows.map((row, index) => (
      <TableRow key={index}>
        <TableCell align="center">{row.EmpCode}</TableCell>
        <TableCell align="left">{row.EmpName}</TableCell>
        <TableCell align="center">{row.Date}</TableCell>
        <TableCell align="center">{row.DayOfWeak}</TableCell>
        <TableCell align="center">{row.InTime}</TableCell>
        <TableCell align="center">{row.BreakOut}</TableCell>
        <TableCell align="center">{row.BreakIn}</TableCell>
        <TableCell align="center">{row.OutTime}</TableCell>
        <TableCell align="center">{row.OTHrs}</TableCell>
        <TableCell align="center">{row.ShiftCode}</TableCell> {/* Shift Code added */}
        <TableCell align="center">{getStatusLabel(row.Status)}</TableCell> {/* Status Label */}
      </TableRow>
    ))
  )}
</TableBody>

                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Box>
      </div>
    </Grid>
  );
}

