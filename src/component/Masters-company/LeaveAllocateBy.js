import React, { useState } from 'react';
import {
    Container, Grid, TextField, Button, MenuItem, Typography, Select, FormControl, InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const LeaveAllocate = () => {
    const [formData, setFormData] = useState({
        allocateBy: '', // New field for allocate by selection
        employeeID: '',
        department: '',
        leaveType: '',
        startDate: null,
        endDate: null,
        totalDays: 0,
    });

    const leaveTypes = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity Leave'];
    const allocateOptions = ['Select', 'Department', 'Employee ID']; // Options for "Allocate By"

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date, field) => {
        setFormData({ ...formData, [field]: date });
        calculateTotalDays();
    };

    const calculateTotalDays = () => {
        const { startDate, endDate } = formData;
        if (startDate && endDate) {
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            setFormData((prevData) => ({ ...prevData, totalDays: days > 0 ? days : 0 }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData); // Replace this with your save function
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h5" align="center" gutterBottom>
                Leave Allocation
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Allocate By Field */}
                    <Grid item xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Allocate Leave By</InputLabel>
                            <Select
                                name="allocateBy"
                                value={formData.allocateBy}
                                onChange={handleChange}
                            >
                                {allocateOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Conditional Fields Based on Allocate By Selection */}
                    {formData.allocateBy === 'Employee ID' && (
                        <Grid item xs={12}>
                            <TextField
                                label="Employee ID"
                                name="employeeID"
                                value={formData.employeeID}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                    )}
                    {formData.allocateBy === 'Department' && (
                        <Grid item xs={12}>
                            <TextField
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                    )}

                    {/* Leave Type Selection */}
                    <Grid item xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Leave Type</InputLabel>
                            <Select
                                name="leaveType"
                                value={formData.leaveType}
                                onChange={handleChange}
                            >
                                {leaveTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Date Pickers for Start and End Dates */}
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Start Date"
                                value={formData.startDate}
                                onChange={(date) => handleDateChange(date, 'startDate')}
                                renderInput={(params) => <TextField {...params} fullWidth required />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="End Date"
                                value={formData.endDate}
                                onChange={(date) => handleDateChange(date, 'endDate')}
                                renderInput={(params) => <TextField {...params} fullWidth required />}
                            />
                        </LocalizationProvider>
                    </Grid>

                    {/* Total Leave Days Display */}
                    <Grid item xs={12}>
                        <TextField
                            label="Total Leave Days"
                            value={formData.totalDays}
                            InputProps={{ readOnly: true }}
                            fullWidth
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default LeaveAllocate;
