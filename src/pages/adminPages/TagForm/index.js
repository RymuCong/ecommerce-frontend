import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { useStyles } from "./style";
import { createTag, editTag } from "../../../redux/slices/admin";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Axios } from "../../../api/instances";
import * as Api from "../../../api/endpoints";
import { withAdminAuth } from "../../../hoc/withAdminAuth";
import { Loader } from "../../../components/Loader/";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const TagFormSchema = Yup.object().shape({
  tagName: Yup.string()
      .min(3, "Tag Name should have at least 3 characters")
      .required("Tag Name is required"),
});

export const TagForm = withAdminAuth(true)(({ edit }) => {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.admin.authLoading);
  const [tagLoading, setTagLoading] = useState(false);
  const [tagData, setTagData] = useState({
    tagName: "",
  });

  useEffect(() => {
    (async () => {
      if (edit) {
        setTagLoading(true);
        const res = await Axios.get(Api.GET_TAG(id));
        console.log(res);
        setTagData({ tagName: res.data.tagName });
        setTagLoading(false);
      }
    })();
  }, [edit, id]);

  const createTagHandler = (values) => {
    if (edit) {
      dispatch(editTag({ id, ...values }));
    } else {
      dispatch(createTag(values));
    }
  };

  return (
      <Container maxWidth="lg">
        {tagLoading ? (
            <Loader />
        ) : (
            <>
              <Typography variant="h3" className={classes.heading}>
                {edit ? "Edit" : "Create"} Tag
              </Typography>
              <Formik
                  initialValues={tagData}
                  enableReinitialize
                  validationSchema={TagFormSchema}
                  onSubmit={createTagHandler}
              >
                {({ values, handleChange, errors, touched }) => (
                    <Form className={classes.form}>
                      <Field
                          as={TextField}
                          label="Tag Name"
                          name="tagName"
                          value={values.tagName}
                          onChange={handleChange}
                          error={touched.tagName && Boolean(errors.tagName)}
                          helperText={touched.tagName && errors.tagName}
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