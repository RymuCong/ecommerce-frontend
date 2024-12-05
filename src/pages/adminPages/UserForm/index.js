import { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Select,
    FormControl,
    InputLabel,
    OutlinedInput,
    Checkbox,
    ListItemText,
} from "@material-ui/core";
import { useStyles } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../../redux/slices/admin";
import { withAdminAuth } from "../../../hoc/withAdminAuth";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const UserFormSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, "First name should have at least 2 characters")
        .required("First name is required"),
    lastName: Yup.string()
        .min(2, "Last name should have at least 2 characters")
        .required("Last name is required"),
    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password should have at least 6 characters")
        .required("Password is required"),
    roles: Yup.array().min(1, "At least one role is required").required("Role is required"),
});

export const UserForm = withAdminAuth(true)(() => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.admin.authLoading);
    const classes = useStyles();
    const [userData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roles: [],
    });

    const createUserHandler = (values) => {
        dispatch(createUser(values));
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h3" className={classes.heading}>
                Create User
            </Typography>
            <Formik
                initialValues={userData}
                validationSchema={UserFormSchema}
                onSubmit={createUserHandler}
            >
                {({ values, handleChange, errors, touched }) => (
                    <Form className={classes.form}>
                        <Field
                            as={TextField}
                            label="First Name"
                            name="firstName"
                            className={classes.textField}
                            value={values.firstName}
                            onChange={handleChange}
                            error={touched.firstName && Boolean(errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
                        />
                        <Field
                            as={TextField}
                            label="Last Name"
                            name="lastName"
                            className={classes.textField}
                            value={values.lastName}
                            onChange={handleChange}
                            error={touched.lastName && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                        />
                        <Field
                            as={TextField}
                            label="Email"
                            name="email"
                            className={classes.textField}
                            value={values.email}
                            onChange={handleChange}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />
                        <Field
                            as={TextField}
                            label="Password"
                            name="password"
                            type="password"
                            className={classes.textField}
                            value={values.password}
                            onChange={handleChange}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                        />
                        <FormControl className={classes.textField}>
                            <InputLabel>Roles</InputLabel>
                            <Select
                                name="roles"
                                multiple
                                value={values.roles}
                                onChange={handleChange}
                                input={<OutlinedInput label="Roles" />}
                                renderValue={(selected) => selected.join(", ")}
                                error={touched.roles && Boolean(errors.roles)}
                            >
                                <MenuItem value="USER">
                                    <Checkbox checked={values.roles.indexOf("USER") > -1} />
                                    <ListItemText primary="USER" />
                                </MenuItem>
                                <MenuItem value="ADMIN">
                                    <Checkbox checked={values.roles.indexOf("ADMIN") > -1} />
                                    <ListItemText primary="ADMIN" />
                                </MenuItem>
                            </Select>
                            {touched.roles && errors.roles && (
                                <div className={classes.error}>{errors.roles}</div>
                            )}
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ color: "white" }}
                            size="large"
                            disabled={loading}
                            endIcon={
                                loading ? <CircularProgress size={20} color="primary" /> : null
                            }
                        >
                            Create
                        </Button>
                    </Form>
                )}
            </Formik>
        </Container>
    );
});