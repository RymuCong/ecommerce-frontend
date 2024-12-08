import {
  Container,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@material-ui/core";
import {} from "@material-ui/icons";
import { useStyles } from "./style";
import { useHistory } from "react-router-dom";
import {useSelector} from "react-redux";
import { withUserAuth } from "../../../hoc/withUserAuth";

export const Profile = withUserAuth(true)((props) => {
  const classes = useStyles();
  const { push } = useHistory();
  const profile = useSelector((state) => state.users.profile);

  console.log(profile);

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" className={classes.heading}>
        Your Profile
      </Typography>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th">Last Name</TableCell>
              <TableCell>{profile?.lastName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">First Name</TableCell>
              <TableCell>{profile?.firstName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">Email</TableCell>
              <TableCell>{profile?.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">Mobile Number</TableCell>
              <TableCell>{profile?.mobileNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">Addresses</TableCell>
              <TableCell>
                {profile?.addresses && profile.addresses.length > 0 ? (
                    profile.addresses.map((address, index) => (
                        <Typography key={index}>{address.addressDetail}</Typography>
                    ))
                ) : (
                    "No address"
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Button
                  onClick={() => push("/edit-profile")}
                  variant="outlined"
                  color="primary"
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
});
