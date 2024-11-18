import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  TextField,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Select,
  FormHelperText,
  Box,
  Container,
  CardContent,
  InputLabel,
} from '@mui/material';
import { postRequest } from '../../../serverconfiguration/requestcomp';
import { ServerConfig } from '../../../serverconfiguration/serverconfig';
import { useNavigate } from 'react-router-dom';
import { REPORTS, SAVE } from '../../../serverconfiguration/controllers';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Navbar from "../../../Component1/Home Page3/Navbar2";
import Sidenav from "../../../Component1/Home Page3/Sidenav2";

export default function PFNominee() {
  const navigate = useNavigate();
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [pnCompanyId, setPnCompanyId] = useState('');
  const [pnBranchId, setPnBranchId] = useState('');
  const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem('user'));
  const[employeeFullName,setEmployeeFullName] = useState('');
  const[pnEmployeeID,setpnEmployeeId] = useState('');
  // Fetch company data
 // Fetch company data
useEffect(() => {
    async function getData() {
      try {
        const companyData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT e.*, c.CompanyName 
                  FROM paym_Employee e 
                  JOIN paym_Company c ON e.pn_CompanyID = c.pn_CompanyID 
                  WHERE e.EmployeeCode = '${isloggedin}'`,
        });
        setCompany(companyData.data);
        if (companyData.data.length > 0) {
          setPnCompanyId(companyData.data[0].pn_CompanyID); // Set default company ID
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    }
    getData();
  }, [isloggedin]);
  

  // Fetch branch data based on company selection
  useEffect(() => {
    async function getData() {
      try {
        const branchData = await postRequest(ServerConfig.url, REPORTS, {
          query: `select * from paym_branch where pn_CompanyID = '${pnCompanyId}'`,
        });
        setBranch(branchData.data);
      } catch (error) {
        console.error('Error fetching branch data:', error);
      }
    }
    if (pnCompanyId) {
      getData();
    }
  }, [pnCompanyId]);

  // Fetch employee full name
  useEffect(() => {
    async function getData() {
      try {
        const employeeData = await postRequest(ServerConfig.url, REPORTS, {
          query: `SELECT * 
                  FROM paym_Employee 
                  WHERE EmployeeCode = '${isloggedin}'`,
        });
        if (employeeData.data.length > 0) {
          setpnEmployeeId(employeeData.data[0].pn_EmployeeID); // Set Employee ID
        }
      } catch (error) {
        console.error('Error fetching employee full name:', error);
      }
    }
    getData();
  }, [isloggedin]);

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    pnCompanyId: Yup.string().required('Please select a Company ID'),
    pnBranchId: Yup.string().required('Please select a Branch ID'),
    nomineeName: Yup.string().required('Nominee Name is required'),
    address1: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    district: Yup.string().required('District is required'),
    city: Yup.string().required('City is required'),
    pinNo: Yup.string()
      .matches(/^[0-9]{6}$/, 'Pin Code must be 6 digits')
      .required('Pin Code is required'),
      pfshare: Yup.number()
      .positive('PF Share must be a positive number')
      .required('PF Share is required'),
  });

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
        const response = await postRequest(ServerConfig.url, SAVE, {
            query: `INSERT INTO [dbo].[PF_EPF]([pn_companyID],[pn_BranchID],[pn_employeeID],[Nominee_Name],[Gender],[DOB],[PF_Share],[Relationship],[address1],[State],[District],[city],[pin_no]) 
                    VALUES (${values.pnCompanyId}, ${values.pnBranchId},${values.pnEmployeeID},'${values.nomineeName}','${values.gender}','${values.dob}', '${values.pfshare}','${values.relationship}','${values.address1}', '${values.state}', '${values.district}', '${values.city}', '${values.pinNo}')
          `});
          

      if (response.status === 200) {
        alert('Data saved successfully');
        resetForm(); // Reset the form after successful submission
        navigate('/NextForm'); // Adjust navigation if needed
      } else {
        alert('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data');
    }
  };

  // Handle form cancellation
  const handleCancel = (resetForm) => {
    resetForm(); // Reset the form on cancel
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <div style={{ backgroundColor: "#fff" }}>
          <Navbar />
          <Box height={30} />
          <Box sx={{ display: "flex" }}>
            <Sidenav/>
            <Grid item xs={12} sm={10} md={9} lg={8} xl={7} style={{ marginLeft: "auto", marginRight: "auto" }}>
              <Container maxWidth="md" sx={{ p: 2 }}>
                <Grid style={{ padding: '80px 5px 0 5px' }}>
                  <Card style={{ maxWidth: 600, margin: '0 auto' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom color="textPrimary" align="center">
                        PF Nominee
                      </Typography>
                      <Formik
                        initialValues={{
                          pnCompanyId: pnCompanyId || '',
                          pnBranchId: pnBranchId || '',
                          pnEmployeeID: pnEmployeeID || '', 
                          nomineeName: '',
                          address1: '',
                          state: '',
                          district: '',
                          city: '',
                          pinNo: '',
                          gender: '',  // Add gender field to initialValues
                          dob:'',
                          pfshare:'',
                          relationship:'',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => handleSubmit(values, { resetForm })}
                        enableReinitialize
                      >
                        {({ values, handleChange, handleBlur, errors, touched, resetForm }) => (
                          <Form>
                            <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
  <FormControl fullWidth error={touched.pnCompanyId && Boolean(errors.pnCompanyId)}>
    <TextField
      value={company.find((c) => c.pn_CompanyID === values.pnCompanyId)?.CompanyName || ''}
      variant="outlined"
      fullWidth
      InputProps={{ readOnly: true }}
    />
    {touched.pnCompanyId && errors.pnCompanyId && (
      <FormHelperText sx={{ color: 'error.main' }}>{errors.pnCompanyId}</FormHelperText>
    )}
  </FormControl>
</Grid>



                              <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={touched.pnBranchId && Boolean(errors.pnBranchId)}>
                      <Select
                        value={values.pnBranchId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="pnBranchId"
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Branch Name
                        </MenuItem>
                        {branch.map((b) => (
                          <MenuItem key={b.pn_BranchID} value={b.pn_BranchID}>
                            {b.BranchName}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.pnBranchId && errors.pnBranchId && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.pnBranchId}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
  <FormControl fullWidth error={touched.pnEmployeeID && Boolean(errors.pnEmployeeID)}>
    <TextField
      value={company.find((c) => c.pn_EmployeeID === values.pnEmployeeID)?.EmployeeCode || ''}
      variant="outlined"
      fullWidth
      InputProps={{ readOnly: true }}
    />
    {touched.pnEmployeeID && errors.pnEmployeeID && (
      <FormHelperText sx={{ color: 'error.main' }}>{errors.pnEmployeeID}</FormHelperText>
    )}
  </FormControl>
</Grid>

                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.nomineeName && Boolean(errors.nomineeName)}>
                                  <TextField
                                    name="nomineeName"
                                    label={<span>Nominee Name<span style={{ color: 'red', marginLeft: '0.2rem' }}>*</span></span>}
                                    variant="outlined"
                                    fullWidth
                                    value={values.nomineeName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {touched.nomineeName && errors.nomineeName && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.nomineeName}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.address1 && Boolean(errors.address1)}>
                                  <TextField
                                    name="address1"
                                    label={<span>Address<span style={{ color: 'red', marginLeft: '0.2rem' }}>*</span></span>}
                                    variant="outlined"
                                    fullWidth
                                    value={values.address1}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {touched.address1 && errors.address1 && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.address1}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.state && Boolean(errors.state)}>
                                  <TextField
                                    name="state"
                                    label={<span>State<span style={{ color: 'red', marginLeft: '0.2rem' }}>*</span></span>}
                                    variant="outlined"
                                    fullWidth
                                    value={values.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {touched.state && errors.state && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.state}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.district && Boolean(errors.district)}>
                                  <TextField
                                    name="district"
                                    label={<span>District<span style={{ color: 'red', marginLeft: '0.2rem' }}>*</span></span>}
                                    variant="outlined"
                                    fullWidth
                                    value={values.district}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {touched.district && errors.district && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.district}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
  <FormControl fullWidth error={touched.gender && Boolean(errors.gender)}>
    {/* <InputLabel id="gender-label">
      Gender<span style={{ color: 'red', marginLeft: '0.2rem' }}>*</span>
    </InputLabel> */}
    <Select
      labelId="gender-label"
      value={values.gender}
      onChange={handleChange}
      onBlur={handleBlur}
      name="gender"
      displayEmpty
      InputLabelProps={{ shrink: true }}
    >
      <MenuItem value="" disabled>
        Select Gender
      </MenuItem>
      <MenuItem value="Male">Male</MenuItem>
      <MenuItem value="Female">Female</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </Select>
    {touched.gender && errors.gender && (
      <FormHelperText sx={{ color: 'error.main' }}>{errors.gender}</FormHelperText>
    )}
  </FormControl>
</Grid>
<Grid item xs={12} sm={6}>
  <FormControl fullWidth error={touched.dob && Boolean(errors.dob)}>
    <TextField
      name="dob"
      label={<span>Date of Birth<span style={{ color: 'red', marginLeft: '0.2rem' }}>*</span></span>}
      type="date"
      variant="outlined"
      fullWidth
      value={values.dob}
      onChange={handleChange}
      onBlur={handleBlur}
      InputLabelProps={{ shrink: true }}
    />
    {touched.dob && errors.dob && (
      <FormHelperText sx={{ color: 'error.main' }}>{errors.dob}</FormHelperText>
    )}
  </FormControl>
</Grid>
<Grid item xs={12} sm={6}>
  <FormControl fullWidth error={touched.pfshare && Boolean(errors.pfshare)}>
    <TextField
      name="pfshare"
      label={<span>PF Share<span style={{ color: 'red', marginLeft: '0.2rem' }}>*</span></span>}
      variant="outlined"
      fullWidth
      type="number"
      inputProps={{ step: "0.01", min: "0" }} // Allows decimal values
      value={values.pfshare}
      onChange={handleChange}
      onBlur={handleBlur}
    />
    {touched.pfshare && errors.pfshare && (
      <FormHelperText sx={{ color: 'error.main' }}>{errors.pfshare}</FormHelperText>
    )}
  </FormControl>
</Grid>

<Grid item xs={12} sm={6}>
  <FormControl fullWidth error={touched.relationship && Boolean(errors.relationship)}>
    <TextField
      name="relationship"
      label={<span>Relationship<span style={{ color: 'red', marginLeft: '0.2rem' }}>*</span></span>}
      variant="outlined"
      fullWidth
      value={values.relationship}
      onChange={handleChange}
      onBlur={handleBlur}
    />
    {touched.relationship && errors.relationship && (
      <FormHelperText sx={{ color: 'error.main' }}>{errors.relationship}</FormHelperText>
    )}
  </FormControl>
</Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.city && Boolean(errors.city)}>
                                  <TextField
                                    name="city"
                                    label={<span>City<span style={{ color: 'red', marginLeft: '0.2rem' }}>*</span></span>}
                                    variant="outlined"
                                    fullWidth
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {touched.city && errors.city && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.city}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.pinNo && Boolean(errors.pinNo)}>
                                  <TextField
                                    name="pinNo"
                                    label={<span>Pin Code<span style={{ color: 'red', marginLeft: '0.2rem' }}>*</span></span>}
                                    variant="outlined"
                                    fullWidth
                                    value={values.pinNo}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                  {touched.pinNo && errors.pinNo && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.pinNo}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            </Grid>
                            <Grid container spacing={1} paddingTop="20px">
                  <Grid item xs={12} align="right">
                    <Button
                      style={{ margin: '0 5px' }}
                      type="button"
                      variant="contained"
                      color="secondary"
                      onClick={() => handleCancel(resetForm)} // Call handleCancel on click
                    >
                      CANCEL
                    </Button>
                    <Button
                      style={{ margin: '0 5px' }}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      SAVE
                    </Button>
                  </Grid>
                </Grid>
                          </Form>
                        )}
                      </Formik>
                    </CardContent>
                  </Card>
                </Grid>
              </Container>
            </Grid>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}