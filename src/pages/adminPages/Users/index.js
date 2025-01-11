import { useEffect, useState, memo } from "react";
import {
  Button,
  Container,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useStyles } from "./style";
import { useDispatch, useSelector } from "react-redux";
import {exportUsersToExcel, fetchUsers, importUsersFromExcel} from "../../../redux/slices/admin";
import { Row } from "./Row";
import { useHistory } from "react-router-dom";
import { withAdminAuth } from "../../../hoc/withAdminAuth";
import { Loader } from "../../../components/Loader/";
import * as XLSX from "xlsx";

export const Users = withAdminAuth(true)((props) => {
  const { push } = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.admin.users);
  const total = useSelector((state) => state.admin.total);
  const loading = useSelector((state) => state.admin.loading);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("userId");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    dispatch(fetchUsers({ pageNumber: page, pageSize: rowsPerPage, sortBy, sortDir }));
  }, [page, rowsPerPage, sortBy, sortDir, dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortDirChange = (event) => {
    setSortDir(event.target.value);
  };

  const exportToExcel = () => {
    dispatch(exportUsersToExcel());
  };

  const importFromExcel = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    dispatch(importUsersFromExcel(file)).then(() => {
      fileInput.value = ""; // Clear the file input
    });
  };

  return (
      <Container maxWidth="lg">
        {loading ? (
            <Loader />
        ) : (
            <>
              <Typography variant="h3" className={classes.heading}>
                Users
              </Typography>
              <Box display="flex" justifyContent="space-between" marginBottom={2}>
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={<Add />}
                    onClick={() => push("/admin/create-user")}
                >
                  Create
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={exportToExcel}
                >
                  Export to Excel
                </Button>
                <input
                    accept=".xlsx, .xls"
                    style={{ display: "none" }}
                    id="import-excel"
                    type="file"
                    onChange={importFromExcel}
                />
                <label htmlFor="import-excel">
                  <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      component="span"
                  >
                    Import from Excel
                  </Button>
                </label>
              </Box>

              <Box marginBottom={5} className={classes.filterRow}>
                <Box marginTop={5} className={classes.sortControls}>
                  <FormControl className={classes.formControl} style={{ marginRight: '20px' }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select value={sortBy} onChange={handleSortByChange}>
                      <MenuItem value="userId">User ID</MenuItem>
                      <MenuItem value="email">Email</MenuItem>
                      <MenuItem value="firstName">First name</MenuItem>
                      <MenuItem value="lastName">Last name</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel>Direction</InputLabel>
                    <Select value={sortDir} onChange={handleSortDirChange}>
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <TableContainer component={Paper} className={classes.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>User ID</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Full Name</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {users.map((user) => (
                        <MemoizedRow key={user.userId} user={user} />
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </>
        )}
      </Container>
  );
});

const MemoizedRow = memo(Row);