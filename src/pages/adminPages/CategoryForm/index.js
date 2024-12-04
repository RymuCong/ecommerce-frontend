import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { useStyles } from "./style";
import { createCategory, editCategory } from "../../../redux/slices/admin";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Axios } from "../../../api/instances";
import * as Api from "../../../api/endpoints";
import { withAdminAuth } from "../../../hoc/withAdminAuth";
import { Loader } from "../../../components/Loader/";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const CategoryFormSchema = Yup.object().shape({
  categoryName: Yup.string()
      .min(3, "Category Name should have at least 3 characters")
      .required("Category Name is required"),
});

export const CategoryForm = withAdminAuth(true)(({ edit }) => {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.admin.authLoading);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    categoryName: "",
  });

  useEffect(() => {
    (async () => {
      if (edit) {
        setCategoryLoading(true);
        const res = await Axios.get(Api.GET_CATEGORY(id));
        setCategoryData({ categoryName: res.data.categoryName });
        setCategoryLoading(false);
      }
    })();
  }, [edit, id]);

  const createCategoryHandler = (values) => {
    if (edit) {
      dispatch(editCategory({ id, ...values }));
    } else {
      dispatch(createCategory(values));
    }
  };

  return (
      <Container maxWidth="lg">
        {categoryLoading ? (
            <Loader />
        ) : (
            <>
              <Typography variant="h3" className={classes.heading}>
                {edit ? "Edit" : "Create"} Category
              </Typography>
              <Formik
                  initialValues={categoryData}
                  enableReinitialize
                  validationSchema={CategoryFormSchema}
                  onSubmit={createCategoryHandler}
              >
                {({ values, handleChange, errors, touched }) => (
                    <Form className={classes.form}>
                      <Field
                          as={TextField}
                          label="Category Name"
                          name="categoryName"
                          value={values.categoryName}
                          onChange={handleChange}
                          error={touched.categoryName && Boolean(errors.categoryName)}
                          helperText={touched.categoryName && errors.categoryName}
                      />
                      <Button
                          style={{ color: "white" }}
                          variant="contained"
                          color="primary"
                          disabled={loading}
                          type="submit"
                          endIcon={
                            loading ? <CircularProgress size={20} color="primary" /> : null
                          }
                      >
                        {edit ? "Edit" : "Create"}
                      </Button>
                    </Form>
                )}
              </Formik>
            </>
        )}
      </Container>
  );
});