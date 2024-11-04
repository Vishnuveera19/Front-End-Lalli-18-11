    import React from 'react';
    import { Box, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
    import { useFormik } from 'formik';
    import * as Yup from 'yup';

    function PFNomineeForm() {
    const formik = useFormik({
        initialValues: {
        nomineeName: '',
        gender: '',
        dob: '',
        pfShare: '',
        relationship: '',
        address1: '',
        state: '',
        district: '',
        city: '',
        pinNo: '',
        },
        validationSchema: Yup.object({
        nomineeName: Yup.string().required('Nominee name is required').max(20, 'Maximum 20 characters allowed'),
        gender: Yup.string().required('Gender is required'),
        dob: Yup.date().required('Date of birth is required'),
        pfShare: Yup.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100%').required('PF Share is required'),
        relationship: Yup.string().required('Relationship is required').max(20, 'Maximum 20 characters allowed'),
        address1: Yup.string().required('Address is required').max(50, 'Maximum 50 characters allowed'),
        state: Yup.string().required('State is required').max(20, 'Maximum 20 characters allowed'),
        district: Yup.string().required('District is required').max(20, 'Maximum 20 characters allowed'),
        city: Yup.string().required('City is required').max(20, 'Maximum 20 characters allowed'),
        pinNo: Yup.string()
            .matches(/^[0-9]{6}$/, 'Enter a valid 6-digit pin code')
            .required('Pin code is required'),
        }),
        onSubmit: (values) => {
        console.log('Form Data:', values);
        // Add submission logic here
        },
    });

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
            PF Nominee Form
        </Typography>
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                fullWidth
                id="nomineeName"
                name="nomineeName"
                label="Nominee Name"
                value={formik.values.nomineeName}
                onChange={formik.handleChange}
                error={formik.touched.nomineeName && Boolean(formik.errors.nomineeName)}
                helperText={formik.touched.nomineeName && formik.errors.nomineeName}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                select
                fullWidth
                id="gender"
                name="gender"
                label="Gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
                >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <TextField
                fullWidth
                id="dob"
                name="dob"
                label="Date of Birth"
                type="date"
                InputLabelProps={{
                    shrink: true,
                }}
                value={formik.values.dob}
                onChange={formik.handleChange}
                error={formik.touched.dob && Boolean(formik.errors.dob)}
                helperText={formik.touched.dob && formik.errors.dob}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                fullWidth
                id="pfShare"
                name="pfShare"
                label="PF Share (%)"
                type="number"
                value={formik.values.pfShare}
                onChange={formik.handleChange}
                error={formik.touched.pfShare && Boolean(formik.errors.pfShare)}
                helperText={formik.touched.pfShare && formik.errors.pfShare}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                fullWidth
                id="relationship"
                name="relationship"
                label="Relationship"
                value={formik.values.relationship}
                onChange={formik.handleChange}
                error={formik.touched.relationship && Boolean(formik.errors.relationship)}
                helperText={formik.touched.relationship && formik.errors.relationship}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                fullWidth
                id="address1"
                name="address1"
                label="Address"
                value={formik.values.address1}
                onChange={formik.handleChange}
                error={formik.touched.address1 && Boolean(formik.errors.address1)}
                helperText={formik.touched.address1 && formik.errors.address1}
                multiline
                rows={3}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                fullWidth
                id="state"
                name="state"
                label="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                fullWidth
                id="district"
                name="district"
                label="District"
                value={formik.values.district}
                onChange={formik.handleChange}
                error={formik.touched.district && Boolean(formik.errors.district)}
                helperText={formik.touched.district && formik.errors.district}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                fullWidth
                id="pinNo"
                name="pinNo"
                label="Pin Code"
                value={formik.values.pinNo}
                onChange={formik.handleChange}
                error={formik.touched.pinNo && Boolean(formik.errors.pinNo)}
                helperText={formik.touched.pinNo && formik.errors.pinNo}
                />
            </Grid>
            <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="accountNo"
                            name="accountNo"
                            label="Account Number"
                            value={formik.values.accountNo}
                            onChange={formik.handleChange}
                            error={formik.touched.accountNo && Boolean(formik.errors.accountNo)}
                            helperText={formik.touched.accountNo && formik.errors.accountNo}
                        />
                    </Grid>
            <Grid item xs={12}>
                <Button color="primary" variant="contained" fullWidth type="submit">
                Submit
                </Button>
            </Grid>
            </Grid>
        </form>
        </Box>
    );
    }

    export default PFNomineeForm;
