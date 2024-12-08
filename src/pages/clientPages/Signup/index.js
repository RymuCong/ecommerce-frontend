import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import { useStyles } from "../Login/style";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../../redux/slices/user";
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
  mobileNumber: yup
      .string()
      .matches(/^\d{10}$/, "Mobile Number must be 10 digits long and contain only numbers")
      .required("Mobile Number is required"),
  email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
  password: yup
      .string()
      .min(3, "Password should be at least 3 characters")
      .required("Password is required"),
  confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required("Confirm Password is required"),
});

export const Signup = withUserAuth(false)((props) => {
  const { push } = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.users.authLoading);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(signup(values));
    },
  });

  return (
      <Container maxWidth="lg" className={classes.root}>
        <Typography variant="h3" className={classes.heading}>
          Signup
        </Typography>

        <Paper component="form" className={classes.form} onSubmit={formik.handleSubmit}>
          <TextField
              label="First Name"
              name="firstName"
              className={classes.textField}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
              label="Last Name"
              name="lastName"
              className={classes.textField}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
          />
          <TextField
              label="Mobile Number"
              name="mobileNumber"
              className={classes.textField}
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
              helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
          />
          <TextField
              label="Email"
              name="email"
              type="email"
              className={classes.textField}
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
              label="Password"
              name="password"
              type="password"
              className={classes.textField}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              className={classes.textField}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
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
            Signup
          </Button>
          <Typography>Already have an account?</Typography>
          <Button
              variant="outlined"
              color="primary"
              onClick={() => push("/login")}
          >
            Login
          </Button>
        </Paper>
      </Container>
  );
});