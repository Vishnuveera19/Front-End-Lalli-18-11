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
import { postRequest } from '../../serverconfiguration/requestcomp';
import { ServerConfig } from '../../serverconfiguration/serverconfig';
import { useNavigate } from 'react-router-dom';
import { REPORTS, SAVE } from '../../serverconfiguration/controllers';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Navbar from "../Home Page-comapny/Navbar1";
import Sidenav from "../Home Page-comapny/Sidenav1";

export default function ESIForm() {
  const navigate = useNavigate();
  const [company, setCompany] = useState([]);
  const [branch, setBranch] = useState([]);
  const [pnCompanyId, setPnCompanyId] = useState('');
  const [pnBranchId, setPnBranchId] = useState('');
  const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem('user'));

  // Fetch company data
  useEffect(() => {
    async function getData() {
      try {
        const companyData = await postRequest(ServerConfig.url, REPORTS, {
          query: `select * from paym_Company where company_user_id = '${isloggedin}'`,
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

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    pnCompanyId: Yup.string().required('Please select a Company ID'),
    pnBranchId: Yup.string().required('Please select a Branch ID'),
    EmployeeCon: Yup.number().required('Employee Contribution is required').positive('Must be positive'),
    EmployerCon: Yup.number().required('Employer Contribution is required').positive('Must be positive'),
    EligibilityAmt: Yup.number().required('Eligibility Amount is required').positive('Must be positive'),
    cRound: Yup.string().required('Please select rounding option'),
    adminCharges: Yup.number().required('Admin Charges are required').positive('Must be positive'),
    d_date: Yup.date().required('Date is required').typeError('Invalid date'),
  });

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await postRequest(ServerConfig.url, SAVE, {
        query: `INSERT INTO [dbo].[paym_ESI]([pn_CompanyID],[pn_BranchID],[Employee_Con],[Employer_Con],[Eligibility_Amt],[c_Round],[d_date],[admin_charges]) 
                VALUES ('${values.pnCompanyId}', '${values.pnBranchId}', ${values.EmployeeCon}, ${values.EmployerCon}, ${values.EligibilityAmt}, '${values.cRound}', '${values.d_date}', ${values.adminCharges})`,
      });

      if (response.status === 200) {
        alert('Data saved successfully');
        resetForm(); // Reset the form after successful submission
        navigate('/NextPage'); // Adjust navigation if needed
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
          <Navbar /> {/* Add Navbar here */}
          <Box height={30} />
          <Box sx={{ display: "flex" }}>
            <Sidenav /> {/* Add Sidebar here */}
            <Grid item xs={12} sm={10} md={9} lg={8} xl={7} style={{ marginLeft: "auto", marginRight: "auto" }}>
              <Container maxWidth="md" sx={{ p: 2 }}>
                <Grid style={{ padding: '80px 5px 0 5px' }}>
                  <Card style={{ maxWidth: 600, margin: '0 auto' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom color="textPrimary" align="center">
                        ESI Form
                      </Typography>
                      <Formik
                        initialValues={{
                          pnCompanyId: pnCompanyId || '',
                          pnBranchId: pnBranchId || '',
                          EmployeeCon: '',
                          EmployerCon: '',
                          EligibilityAmt: '',
                          cRound: '',
                          adminCharges: '',
                          d_date: new Date(),
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
                              {/* Other fields (EmployeeCon, EmployerCon, etc.) */}
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.EmployeeCon && Boolean(errors.EmployeeCon)}>
                                  <TextField
                                    name="EmployeeCon"
                                    label="Employee Contribution"
                                    variant="outlined"
                                    fullWidth
                                    value={values.EmployeeCon}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="number"
                                  />
                                  {touched.EmployeeCon && errors.EmployeeCon && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.EmployeeCon}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.EmployerCon && Boolean(errors.EmployerCon)}>
                                  <TextField
                                    name="EmployerCon"
                                    label="Employer Contribution"
                                    variant="outlined"
                                    fullWidth
                                    value={values.EmployerCon}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="number"
                                  />
                                  {touched.EmployerCon && errors.EmployerCon && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.EmployerCon}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.EligibilityAmt && Boolean(errors.EligibilityAmt)}>
                                  <TextField
                                    name="EligibilityAmt"
                                    label="Eligibility Amount"
                                    variant="outlined"
                                    fullWidth
                                    value={values.EligibilityAmt}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="number"
                                  />
                                  {touched.EligibilityAmt && errors.EligibilityAmt && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.EligibilityAmt}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.cRound && Boolean(errors.cRound)}>
                                  <Select
                                    name="cRound"
                                    value={values.cRound}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    displayEmpty
                                  >
                                    <MenuItem value="" disabled>
                                      Round Option
                                    </MenuItem>
                                    <MenuItem value="Y">yes</MenuItem>
                                    <MenuItem value="N">No</MenuItem>
                                  </Select>
                                  {touched.cRound && errors.cRound && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.cRound}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.adminCharges && Boolean(errors.adminCharges)}>
                                 <TextField
                                    name="adminCharges"
                                    label="Admin Charges"
                                    variant="outlined"
                                    fullWidth
                                    value={values.adminCharges}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="number"
                                  />
                                  {touched.adminCharges && errors.adminCharges && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.adminCharges}</FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.d_date && Boolean(errors.d_date)}>
                                  <TextField
                                    name="d_date"
                                    label="Date"
                                    variant="outlined"
                                    type="date"
                                    fullWidth
                                    value={values.d_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                  />
                                  {touched.d_date && errors.d_date && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.d_date}</FormHelperText>
                                  )}
                                </FormControl>
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
                                    SUBMIT
                                  </Button>
                                </Grid>
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
