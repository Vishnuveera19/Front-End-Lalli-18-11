  import React, { useState, useEffect } from 'react';
  import {
    Grid,
    Card,
    TextField,
    Button,
    FormControl,
    MenuItem,
    Select,
    FormHelperText, Container,
    CardContent,
    InputLabel,
  } from '@mui/material';
 
  import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from '@mui/material';
  import { getRequest, postRequest } from '../../serverconfiguration/requestcomp';
  import { ServerConfig } from '../../serverconfiguration/serverconfig';
  import { useNavigate } from 'react-router-dom';
  import { PAYMCOMPANIES, PAYMBRANCHES, SAVE, REPORTS } from '../../serverconfiguration/controllers';
  import { Formik, Form } from 'formik';
  import * as Yup from 'yup';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  

  export default function BankFormMaster() {
    const navigate = useNavigate();
    const [company, setCompany] = useState([]);
    const [branch, setBranch] = useState([]);
    const [pnCompanyId, setPnCompanyId] = useState('');
    const [pnBranchId, setPnBranchId] = useState('');
    const [isloggedin, setIsloggedin] = useState(sessionStorage.getItem('user'));
    const [bankData, setBankData] = useState([]); // New state for bank data
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
  
    useEffect(() => {
      async function getData() {
        try {
          const companyData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM paym_Company WHERE company_user_id = '${isloggedin}'`,
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

    useEffect(() => {
      async function getData() {
        try {
          const branchData = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM paym_Branch WHERE pn_CompanyID = '${pnCompanyId}'`,
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

    useEffect(() => {
      async function fetchBankData() {
        try {
          const bankResponse = await postRequest(ServerConfig.url, REPORTS, {
            query: `SELECT * FROM paym_Bank`,
          });
          setBankData(bankResponse.data);
        } catch (error) {
          console.error('Error fetching bank data:', error);
        }
      }
      fetchBankData();
    }, []);

    const validationSchema = Yup.object({
      v_BankName: Yup.string()
        .required('Bank Name is required')
        .max(50, 'Bank Name must be up to 50 characters'),
      v_BankCode: Yup.string()
        .required('Bank Code is required')
        .max(50, 'Bank Code must be up to 50 characters'),
        Branch_Name : Yup.string()
        .required('Branch Name is required')
        .max(50, 'Branch Name must be up to 50 characters'),
      status: Yup.string()
        .required('Status is required')
        .matches(/^[AI]$/, 'Status must be A (Active) or I (Inactive)'),
      Account_Type: Yup.string().required('Account Type is required'),
      Micr_Code: Yup.string().max(20, 'MICR Code must be up to 20 characters'),
      Ifsc_Code: Yup.string().max(20, 'IFSC Code must be up to 20 characters'),
    });

    const handleSubmit = async (values, { resetForm }) => {
      try {
        console.log('Submitting form values:', values); // Debugging to check values
        const response = await postRequest(ServerConfig.url, SAVE, {
          query: `INSERT INTO [dbo].[paym_Bank] ([pn_CompanyID], [pn_BranchID], [v_BankName], [v_BankCode], [Branch_Name],[status], [Account_Type], [Micr_Code], [Ifsc_Code], [Address], [others]) VALUES 
                    ('${values.pnCompanyId}', '${values.pnBranchId}', '${values.v_BankName}', '${values.v_BankCode}', '${values.Branch_Name}','${values.status}', '${values.Account_Type}', '${values.Micr_Code}', '${values.Ifsc_Code}', '${values.Address}', '${values.others}')`,
        });
        console.log('Response:', response); // Check the response from the server
    
        if (response.status === 200) {
          alert('Data saved successfully');
          resetForm();
          navigate('/BankStatusFormMaster');
        } else {
          alert('Failed to save data');
        }
      } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to save data');
      }
    };
    
    const handleCancel = (resetForm) => {
      resetForm(); // Reset the form on cancel
    };


    const handleEdit = (bank) => {
      // Implement your edit logic here, e.g., open a form/modal to edit bank details
      console.log('Edit Bank:', bank);
    };
  
    const handleDelete = (bank) => {
      setSelectedBank(bank);
      setOpenDialog(true);
    };
  
    const confirmDelete = () => {
      // Implement your delete logic here
      console.log('Delete Bank:', selectedBank);
      setSnackbarMessage(`Bank ${selectedBank.v_BankName} deleted successfully.`);
      setSnackbarOpen(true);
      setOpenDialog(false);
    };
  
    const handleDialogClose = () => {
      setOpenDialog(false);
    };
  
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };

    return (
      <Grid container>
        <Grid item xs={12}>
          <div style={{ backgroundColor: "#fff" }}>
        
            <Box height={30} />
            <Box sx={{ display: "flex" }}>
          
              <Grid item xs={12} sm={10} md={9} lg={8} xl={7} style={{ marginLeft: "auto", marginRight: "auto" }}>
                <Container maxWidth="md" sx={{ p: 2 }}>
                  <Card style={{ maxWidth: 600, margin: '0 auto' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom color="textPrimary" align="center">
                      Company Bank Details
                      </Typography>
                      <Formik
                        initialValues={{
                          pnCompanyId: pnCompanyId || '',
                          pnBranchId: pnBranchId || '',
                          v_BankName: '',
                          v_BankCode: '',
                          Branch_Name:'',
                          status: '',
                          Account_Type: '',
                          Micr_Code: '',
                          Ifsc_Code: '',
                          Address: '',
                          others: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                      >
                        {({ values, handleChange, handleBlur, errors, touched, resetForm }) => (
                          <Form>
                            <Grid container spacing={2}>
                              {/* Company and Branch Fields */}
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  value={company.find((c) => c.pn_CompanyID === values.pnCompanyId)?.CompanyName || ''}
                                  variant="outlined"
                                  fullWidth
                                  InputProps={{ readOnly: true }}
                                  error={touched.pnCompanyId && Boolean(errors.pnCompanyId)}
                                  helperText={touched.pnCompanyId && errors.pnCompanyId}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={touched.pnBranchId && Boolean(errors.pnBranchId)}>
                                  <Select
                                    name="pnBranchId"
                                    value={values.pnBranchId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  >
                                    <MenuItem value="" disabled>Branch Name</MenuItem>
                                    {branch.map((b) => (
                                      <MenuItem key={b.pn_BranchID} value={b.pn_BranchID}>
                                        {b.BranchName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <FormHelperText>{touched.pnBranchId && errors.pnBranchId}</FormHelperText>
                                </FormControl>
                              </Grid>

                              {/* Bank Fields */}
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  name="v_BankName"
                                  label="Bank Name"
                                  variant="outlined"
                                  fullWidth
                                  value={values.v_BankName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.v_BankName && Boolean(errors.v_BankName)}
                                  helperText={touched.v_BankName && errors.v_BankName}
                                  required
                                InputLabelProps={{
                                  sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                                }}
                                />
                              </Grid>

                              {/* Additional Fields */}
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  name="v_BankCode"
                                  label="Bank Code"
                                  variant="outlined"
                                  fullWidth
                                  value={values.v_BankCode}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.v_BankCode && Boolean(errors.v_BankCode)}
                                  helperText={touched.v_BankCode && errors.v_BankCode}
                                  required
                                  InputLabelProps={{
                                    sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  name="Branch_Name"
                                  label="Branch Name"
                                  variant="outlined"
                                  fullWidth
                                  value={values.Branch_Name}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.Branch_Name && Boolean(errors.Branch_Name)}
                                  helperText={touched.Branch_Name && errors.Branch_Name}
                                  required
                                  InputLabelProps={{
                                    sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  name="Account_Type"
                                  label="Account_Type"
                                  variant="outlined"
                                  fullWidth
                                  value={values.Account_Type}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.Account_Type && Boolean(errors.Account_Type)}
                                  helperText={touched.Account_Type && errors.Account_Type}
                                  required
                                InputLabelProps={{
                                  sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                                }}
                                />
                              </Grid>

                              {/* Additional Fields */}
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  name="Micr_Code"
                                  label="Micr_Code"
                                  variant="outlined"
                                  fullWidth
                                  value={values.Micr_Code}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.Micr_Code && Boolean(errors.Micr_Code)}
                                  helperText={touched.Micr_Code && errors.Micr_Code}
                                  required
                                InputLabelProps={{
                                  sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                                }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  name="Ifsc_Code"
                                  label="Ifsc_Code"
                                  variant="outlined"
                                  fullWidth
                                  value={values.Ifsc_Code}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.Ifsc_Code&& Boolean(errors.Ifsc_Code)}
                                  helperText={touched.Ifsc_Code && errors.Ifsc_Code}
                                  required
                                InputLabelProps={{
                                  sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                                }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  name="Address"
                                  label="Address"
                                  variant="outlined"
                                  fullWidth
                                  value={values.Address}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.Address && Boolean(errors.Address)}
                                  helperText={touched.Address && errors.Address}
                                  required
                                InputLabelProps={{
                                  sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
                                }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
  <FormControl fullWidth error={touched.status && Boolean(errors.status)}>
    <InputLabel>Status</InputLabel>
    <Select
      name="status"
      label="Status"
      required
      InputLabelProps={{
        sx: { '& .MuiFormLabel-asterisk': { color: 'red' } },
      }}
      value={values.status}
      onChange={handleChange}
      onBlur={handleBlur}
    
    >
      <MenuItem value="A">Active</MenuItem>
      <MenuItem value="I">Inactive</MenuItem>
      
    </Select>
    <FormHelperText>{touched.status && errors.status}</FormHelperText>
  </FormControl>
  
</Grid>

                              <Grid item xs={12} sm={6}>
                                <TextField
                                  name="others"
                                  label="others"
                                  variant="outlined"
                                  fullWidth
                                  value={values.others}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.others && Boolean(errors.others)}
                                  helperText={touched.others && errors.others}
                                 
                                />
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
                            </Grid>
                          </Form>
                        )}
                      </Formik>
                    </CardContent>
                  </Card>
                  <Box mt={4}>
                  <Typography variant="h6" gutterBottom color="textPrimary">
                    Bank Details
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="bank details table">
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Bank Name</TableCell>
                          <TableCell>Bank Code</TableCell>
                          <TableCell>Branch Name</TableCell>
                          <TableCell>Account Type</TableCell>
                          <TableCell>MICR Code</TableCell>
                          <TableCell>IFSC Code</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Address</TableCell>
                          <TableCell>Others</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bankData.map((bank) => (
                          <TableRow key={bank.pn_BankID}>
                            <TableCell>{bank.pn_BankID}</TableCell>
                            <TableCell>{bank.v_BankName}</TableCell>
                            <TableCell>{bank.v_BankCode}</TableCell>
                            <TableCell>{bank.Branch_Name}</TableCell>
                            <TableCell>{bank.Account_Type}</TableCell>
                            <TableCell>{bank.Micr_Code}</TableCell>
                            <TableCell>{bank.Ifsc_Code}</TableCell>
                            <TableCell>{bank.status}</TableCell>
                            <TableCell>{bank.Address}</TableCell>
                            <TableCell>{bank.others}</TableCell>
                           <TableCell>
                  <IconButton onClick={() => handleEdit(bank)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(bank)}>
                    <DeleteIcon color="secondary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedBank?.v_BankName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
                </Container>
              </Grid>
            </Box>
          </div>
        </Grid>
      </Grid>
    );
  }
