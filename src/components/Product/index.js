import { useStyles } from "./style";
import {
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/user";

export const Product = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { push } = useHistory();
  const loading = useSelector((state) => state.users.cartLoading);

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={() => push(`/product/${props.productId}`)}>
        <CardMedia
          style={{ height: "250px", backgroundSize: "contain" }}
          className={classes.media}
          image={props.image}
          title={props.productName}
        />
      </CardActionArea>

      <CardContent>
        <Typography
          className={classes.category}
          component={Link}
          to={`/category/${props.category.categoryId}`}
        >
          {props.category.categoryName}
        </Typography>
        <Typography
          className={classes.name}
          variant="h5"
          component={Link}
          to={`/product/${props._id}`}
        >
          {props.productName}
        </Typography>
        <Typography className={classes.price}>${props.price}</Typography>
        {/*<div className={classes.reviews}>*/}
        {/*  <Rating value={props.rating} readOnly />*/}
        {/*  <Typography>({props.reviews.length} Reviews)</Typography>*/}
        {/*</div>*/}
      </CardContent>

      <CardActions className={classes.actions}>
        <Button
          size="small"
          color="primary"
          onClick={() => push(`/product/${props.productId}`)}
        >
          View
        </Button>
        <Button
          size="small"
          color="secondary"
          onClick={() => dispatch(addToCart(props.productId))}
          disabled={loading}
          endIcon={
            loading ? <CircularProgress size={20} color="secondary" /> : null
          }
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};
