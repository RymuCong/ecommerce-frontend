import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    TextField,
    MenuItem,
    Button,
    InputAdornment,
    CircularProgress,
    Select,
    Chip,
    FormControl,
    InputLabel,
    OutlinedInput,
} from "@material-ui/core";
import { CameraAltOutlined } from "@material-ui/icons";
import { useStyles } from "./style";
import { AdminAxios, Axios } from "../../../api/instances";
import * as Api from "../../../api/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, editProduct } from "../../../redux/slices/admin";
import { useParams } from "react-router-dom";
import { withAdminAuth } from "../../../hoc/withAdminAuth";
import { Loader } from "../../../components/Loader/";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const ProductFormSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "Product name should have at least 3 characters")
        .required("Product name is required"),
    description: Yup.string()
        .min(6, "Product description should have at least 6 characters")
        .required("Product description is required"),
    category: Yup.string().required("Category is required"),
    price: Yup.number().required("Price is required"),
    quantity: Yup.number().required("Quantity is required"),
    discount: Yup.number().min(0, "Discount cannot be negative"),
    tags: Yup.array().min(1, "At least one tag is required"),
});

export const ProductForm = withAdminAuth(true)(({ edit }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [productLoading, setProductLoading] = useState(false);
    const loading = useSelector((state) => state.admin.authLoading);
    const classes = useStyles();
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [src, setSrc] = useState("");
    const [file, setFile] = useState(null);
    const [productData, setProductData] = useState({
        productName: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        discount: 0,
        tags: [],
        image : "",
    });

    const updateProductData = ({
                                   productName,
                                   description,
                                   category,
                                   image,
                                   price,
                                   quantity,
                                   discount,
                                   tags,
                               }) => {
        setProductData({
            productName,
            description,
            category: category.categoryId,
            price,
            quantity,
            discount,
            tags: tags.map(tag => tag.tagId),
            image,
        });
    };

    useEffect(() => {
        (async () => {
            if (edit) {
                setProductLoading(true);
                const productResponse = await AdminAxios.get(Api.ADMIN_PRODUCT(id));
                console.log(productResponse.data);
                updateProductData(productResponse.data);
                setProductLoading(false);
            }
        })();

        (async () => {
            const categoriesResponse = await Axios.get(Api.GET_CATEGORIES);
            setCategories(categoriesResponse.data.categories);
        })();

        (async () => {
            const tagsResponse = await Axios.get(Api.GET_TAGS);
            setTags(tagsResponse.data.tags);
        })();
    }, []);

    const changeImageHandler = async (e) => {
        const file = e?.target?.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setFile(file);
                setSrc(reader.result);
            };
        }
    };

    const createProductHandler = (values) => {
        if (edit) {
            dispatch(
                editProduct({
                    id,
                    ...values,
                    file,
                })
            );
        } else {
            dispatch(
                createProduct({
                    ...values,
                    file,
                })
            );
        }
    };

    return (
        <Container maxWidth="lg">
            {productLoading ? (
                <Loader />
            ) : (
                <>
                    <Typography variant="h3" className={classes.heading}>
                        {edit ? "Edit" : "Create"} Product
                    </Typography>
                    <Formik
                        initialValues={{
                            name: edit ? productData.productName : "",
                            description: edit ? productData.description : "",
                            category: edit ? productData.category : "",
                            price: edit ? productData.price : "",
                            quantity: edit ? productData.quantity : "",
                            discount: edit ? productData.discount : 0,
                            tags: edit ? productData.tags : [],
                            image: edit ? productData.image : "",
                        }}
                        validationSchema={ProductFormSchema}
                        onSubmit={createProductHandler}
                    >
                        {({ values, handleChange, setFieldValue, errors, touched }) => (
                            <Form className={classes.form}>
                                <Field
                                    as={TextField}
                                    label="Name"
                                    name="name"
                                    className={classes.textField}
                                    value={values.name}
                                    onChange={handleChange}
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                                <Field
                                    as={TextField}
                                    className={classes.textField}
                                    label="Description"
                                    name="description"
                                    multiline
                                    rows={4}
                                    value={values.description}
                                    onChange={handleChange}
                                    error={touched.description && Boolean(errors.description)}
                                    helperText={touched.description && errors.description}
                                />
                                <Field
                                    as={TextField}
                                    select
                                    label="Category"
                                    name="category"
                                    value={values.category}
                                    onChange={handleChange}
                                    error={touched.category && Boolean(errors.category)}
                                    helperText={touched.category && errors.category}
                                >
                                    {categories.map(({categoryId, categoryName}) => (
                                        <MenuItem key={categoryId} value={categoryId}>
                                            {categoryName}
                                        </MenuItem>
                                    ))}
                                </Field>
                                <FormControl className={classes.textField}>
                                    <InputLabel>Tags</InputLabel>
                                    <Select
                                        multiple
                                        name="tags"
                                        value={values.tags}
                                        onChange={(e) => setFieldValue("tags", e.target.value)}
                                        input={<OutlinedInput label="Tags"/>}
                                        renderValue={(selected) => (
                                            <div className={classes.chips}>
                                                {selected.map((value) => (
                                                    <Chip key={value}
                                                          label={tags.find(tag => tag.tagId === value)?.tagName || ''}
                                                          className={classes.chip}/>
                                                ))}
                                            </div>
                                        )}
                                        error={touched.tags && Boolean(errors.tags)}
                                    >
                                        {tags.map(({tagId, tagName}) => (
                                            <MenuItem key={tagId} value={tagId}>
                                                {tagName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.tags && errors.tags && (
                                        <div className={classes.error}>{errors.tags}</div>
                                    )}
                                </FormControl>
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/png, image/jpg, image/jpeg, image/webp"
                                    hidden
                                    onChange={changeImageHandler}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{color: "white"}}
                                    component="label"
                                    htmlFor="fileInput"
                                    endIcon={<CameraAltOutlined/>}
                                    size="small"
                                >
                                    Upload Image
                                </Button>
                                <div className={classes.img}>
                                    <img src={src || values.image} alt="Preview image"/>
                                </div>
                                <Field
                                    as={TextField}
                                    type="number"
                                    label="Price"
                                    name="price"
                                    value={values.price}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">VNĐ</InputAdornment>
                                        ),
                                    }}
                                    error={touched.price && Boolean(errors.price)}
                                    helperText={touched.price && errors.price}
                                />
                                <Field
                                    as={TextField}
                                    type="number"
                                    label="Quantity"
                                    name="quantity"
                                    value={values.quantity}
                                    onChange={handleChange}
                                    error={touched.quantity && Boolean(errors.quantity)}
                                    helperText={touched.quantity && errors.quantity}
                                />
                                <Field
                                    as={TextField}
                                    type="number"
                                    label="Discount"
                                    name="discount"
                                    value={values.discount}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">%</InputAdornment>
                                        ),
                                    }}
                                    error={touched.discount && Boolean(errors.discount)}
                                    helperText={touched.discount && errors.discount}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    style={{color: "white"}}
                                    size="large"
                                    disabled={loading}
                                    endIcon={
                                        loading ? <CircularProgress size={20} color="primary"/> : null
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