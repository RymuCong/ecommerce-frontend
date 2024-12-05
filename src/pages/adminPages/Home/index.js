import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Grid,
} from "@material-ui/core";
import {} from "@material-ui/icons";
import { useStyles } from "./style";
import { withAdminAuth } from "../../../hoc/withAdminAuth";
import { Link } from "react-router-dom";

export const Home = withAdminAuth(true)((props) => {
  const classes = useStyles();

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item md={3}>
            <Paper className={classes.paper}>
              <Typography component={Link} to="/admin/products" variant="h6">
                Products
              </Typography>
            </Paper>
          </Grid>
          <Grid item md={3}>
            <Paper className={classes.paper}>
              <Typography component={Link} to="/admin/categories" variant="h6">
                Categories
              </Typography>
            </Paper>
          </Grid>
          <Grid item md={3}>
            <Paper className={classes.paper}>
              <Typography component={Link} to="/admin/orders" variant="h6">
                Orders
              </Typography>
            </Paper>
          </Grid>
          <Grid item md={3}>
            <Paper className={classes.paper}>
              <Typography component={Link} to="/admin/tags" variant="h6">
                Tags
              </Typography>
            </Paper>
          </Grid>
          <Grid item md={3}>
            <Paper className={classes.paper}>
              <Typography component={Link} to="/admin/users" variant="h6">
                Users
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
});
