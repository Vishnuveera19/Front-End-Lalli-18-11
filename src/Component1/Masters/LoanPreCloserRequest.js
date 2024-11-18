import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

// Sample data for existing requests
const sampleRequests = [
  {
    id: 1,
    loanType: "Personal Loan",
    amount: 5000,
    requestDate: "2024-11-10",
    status: "Pending",
    reason: "Early repayment to reduce interest",
  },
  {
    id: 2,
    loanType: "Car Loan",
    amount: 15000,
    requestDate: "2024-11-12",
    status: "Approved",
    reason: "Vehicle sold",
  },
];

const validationSchema = Yup.object({
  loanType: Yup.string().required("Loan type is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  reason: Yup.string()
    .required("Reason for preclosure is required")
    .max(255, "Reason cannot exceed 255 characters"),
  requestDate: Yup.date().required("Request date is required"),
});

const LoanPreclosureRequest = () => {
  const [requests, setRequests] = useState(sampleRequests);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRequestSubmit = (values, { resetForm }) => {
    const newRequest = {
      id: requests.length + 1,
      loanType: values.loanType,
      amount: values.amount,
      requestDate: values.requestDate,
      status: "Pending",
      reason: values.reason,
    };
    setRequests([...requests, newRequest]);
    resetForm();
    handleClose();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Employee Loan Preclosure Requests
      </Typography>

      {/* DataGrid for displaying existing requests */}
      <Box sx={{ height: 400, marginBottom: 2 }}>
        <DataGrid
          rows={requests}
          columns={[
            { field: "id", headerName: "ID", width: 90 },
            { field: "loanType", headerName: "Loan Type", width: 200 },
            { field: "amount", headerName: "Amount", width: 150 },
            { field: "requestDate", headerName: "Request Date", width: 150 },
            { field: "status", headerName: "Status", width: 150 },
            { field: "reason", headerName: "Reason", width: 300 },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>

      {/* Button to open the request form dialog */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        New Loan Preclosure Request
      </Button>

      {/* Form Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Loan Preclosure Request</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              loanType: "",
              amount: "",
              reason: "",
              requestDate: moment().format("YYYY-MM-DD"),
            }}
            validationSchema={validationSchema}
            onSubmit={handleRequestSubmit}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="loanType"
                      label="Loan Type"
                      variant="outlined"
                      fullWidth
                      error={touched.loanType && Boolean(errors.loanType)}
                      helperText={touched.loanType && errors.loanType}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="amount"
                      label="Amount"
                      type="number"
                      variant="outlined"
                      fullWidth
                      error={touched.amount && Boolean(errors.amount)}
                      helperText={touched.amount && errors.amount}
                    />
                  </Grid>

                  {/* LocalizationProvider for DatePicker */}
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        label="Request Date"
                        inputFormat="YYYY-MM-DD"
                        value={values.requestDate}
                        onChange={(date) =>
                          setFieldValue("requestDate", moment(date).format("YYYY-MM-DD"))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={touched.requestDate && Boolean(errors.requestDate)}
                            helperText={touched.requestDate && errors.requestDate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="reason"
                      label="Reason for Preclosure"
                      multiline
                      rows={3}
                      variant="outlined"
                      fullWidth
                      error={touched.reason && Boolean(errors.reason)}
                      helperText={touched.reason && errors.reason}
                    />
                  </Grid>
                </Grid>
                <DialogActions>
                  <Button onClick={handleClose} color="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" variant="contained">
                    Submit Request
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default LoanPreclosureRequest;
