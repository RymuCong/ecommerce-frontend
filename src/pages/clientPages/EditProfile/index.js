import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import { useStyles } from "../Login/style";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../../redux/slices/user";
import { useHistory } from "react-router-dom";
import { withUserAuth } from "../../../hoc/withUserAuth";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object({
  firstName: yup
      .string()
      .min(1, "First Name should be within 1 to 20 characters")
      .max(20, "First Name should be within 1 to 20 characters")
      .required("First Name is required"),
  lastName: yup
      .string()
      .min(1, "Last Name should be within 1 to 20 characters")
      .max(20, "Last Name should be within 1 to 20 characters")
      .required("Last Name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
      .string()
      .min(3, "Password should be at least 3 characters"),
  mobileNumber: yup
      .string()
      .matches(/^\d{10}$/, "Mobile Number must be 10 digits long")
      .required("Mobile Number is required"),
  addresses: yup.array().of(
      yup.object({
        addressDetail: yup
            .string()
            .min(5, "Address must have at least 5 characters")
            .required("Address is required"),
      })
  ),
});

export const EditProfile = withUserAuth(true)((props) => {
  const classes = useStyles();
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.users.authLoading);

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: user?.password || "",
      mobileNumber: user?.mobileNumber || "",
      addresses: user?.addresses || [{ addressDetail: "" }],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(editUser(values));
    },
  });

  const addAddressHandler = () => {
    formik.setFieldValue("addresses", [
      ...formik.values.addresses,
      { addressDetail: "" },
    ]);
  };

  const deleteAddressHandler = (index) => {
    const newAddresses = formik.values.addresses.filter((_, i) => i !== index);
    formik.setFieldValue("addresses", newAddresses);
  };

  return (
      <Container maxWidth="lg" className={classes.root}>
        <Typography variant="h3" className={classes.heading}>
          Edit Profile
        </Typography>

        <Paper component="form" className={classes.form} onSubmit={formik.handleSubmit}>
          <TextField
              label="First Name"
              className={classes.textField}
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
              label="Last Name"
              className={classes.textField}
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
          />
          <TextField
              label="Email"
              type="email"
              className={classes.textField}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
              label="Password"
              type="password"
              className={classes.textField}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
              label="Mobile Number"
              className={classes.textField}
              name="mobileNumber"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
              helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
          />
          <Typography variant="h6">Addresses</Typography>
          {formik.values.addresses.map((address, index) => (
              <div key={index} className={classes.addressField}>
                <TextField
                    label={`Address ${index + 1}`}
                    className={classes.textField}
                    name={`addresses[${index}].addressDetail`}
                    value={address.addressDetail}
                    onChange={formik.handleChange}
                    error={
                        formik.touched.addresses &&
                        formik.touched.addresses[index] &&
                        Boolean(formik.errors.addresses?.[index]?.addressDetail)
                    }
                    helperText={
                        formik.touched.addresses &&
                        formik.touched.addresses[index] &&
                        formik.errors.addresses?.[index]?.addressDetail
                    }
                />
                <IconButton onClick={() => deleteAddressHandler(index)}>
                  <Delete />
                </IconButton>
              </div>
          ))}
          <Button
              variant="contained"
              color="primary"
              onClick={addAddressHandler}
              startIcon={<Add />}
          >
            Add Address
          </Button>
          <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ color: "white" }}
              disabled={loading}
              endIcon={
                loading ? <CircularProgress size={20} color="primary" /> : null
              }
          >
            Edit
          </Button>
        </Paper>
      </Container>
  );
});