import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    TextField,
    MenuItem,
    Button,
    InputAdornment,
    CircularProgress,
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

export const ProductForm = withAdminAuth(true)(({ edit }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [productLoading, setProductLoading] = useState(false);
    const loading = useSelector((state) => state.admin.authLoading);
    const classes = useStyles();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState();
    const [src, setSrc] = useState("");
    const [file, setFile] = useState(null);
    const [price, setPrice] = useState();
    const [quantity, setQuantity] = useState();
    const [discount, setDiscount] = useState(0);

    const changeNameHandler = (e) => setName(e.target.value);
    const changeDescriptionHandler = (e) => setDescription(e.target.value);
    const changeCategoryHandler = (e) => setCategory(e.target.value);
    const changePriceHandler = (e) => setPrice(e.target.value);
    const changeQuantityHandler = (e) => setQuantity(e.target.value);
    const changeDiscountHandler = (e) => setDiscount(e.target.value);
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

    const setProductData = ({
                                name,
                                description,
                                category,
                                image,
                                price,
                                quantity,
                                discount,
                            }) => {
        setName(name);
        setDescription(description);
        setCategory(category.categoryId);
        setPrice(price);
        setQuantity(quantity);
        setDiscount(discount);
        setSrc(image);
        setFile(image);
    };

    useEffect(() => {
        (async () => {
            if (edit) {
                setProductLoading(true);
                const productResponse = await AdminAxios.get(Api.ADMIN_PRODUCT(id));
                setProductData(productResponse.data.product);
                setProductLoading(false);
            }
        })();

        (async () => {
            const categoriesResponse = await Axios.get(Api.GET_CATEGORIES);
            setCategories(categoriesResponse.data.categories);
        })();
    }, []);

  const createProductHandler = (e) => {
    e.preventDefault();
    if (edit) {
      dispatch(
        editProduct({
          id,
          name,
          description,
          file,
          category,
          price,
          quantity,
            discount,
        })
      );
    } else {
      dispatch(
        createProduct({
          name,
          description,
          file,
          category,
          price,
          quantity,
            discount,
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
                    <form className={classes.form} onSubmit={createProductHandler}>
                        <TextField
                            label="Name"
                            className={classes.textField}
                            value={name}
                            onChange={changeNameHandler}
                        />
                        <TextField
                            className={classes.textField}
                            label="Description"
                            multiline
                            rows={4}
                            value={description}
                            onChange={changeDescriptionHandler}
                        />
                        <TextField
                            select
                            label="Category"
                            value={category}
                            onChange={changeCategoryHandler}
                        >
                            {categories.map(({ categoryId, categoryName }) => (
                                <MenuItem key={categoryId} value={categoryId}>
                                    {categoryName}
                                </MenuItem>
                            ))}
                        </TextField>
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
                            style={{ color: "white" }}
                            component="label"
                            htmlFor="fileInput"
                            endIcon={<CameraAltOutlined />}
                            size="small"
                        >
                            Upload Image
                        </Button>
                        <div className={classes.img}>
                            <img src={src} alt="Preview image"/>
                        </div>
                        <TextField
                            type="number"
                            label="Price"
                            value={price}
                            onChange={changePriceHandler}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">VNĐ</InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            type="number"
                            label="Quantity"
                            value={quantity}
                            onChange={changeQuantityHandler}
                        />
                        <TextField
                            type="number"
                            label="Discount"
                            value={discount}
                            onChange={changeDiscountHandler}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">%</InputAdornment>
                                ),
                            }}
                        />
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
                            {edit ? "Edit" : "Create"}
                        </Button>
                    </form>
                </>
            )}
        </Container>
    );
});