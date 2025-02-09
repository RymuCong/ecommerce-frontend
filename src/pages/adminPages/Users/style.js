import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  heading: {
    fontWeight: "bold",
    margin: "30px 0",
  },
  tableContainer: {
    marginTop: "30px",
    "& th": {
      fontWeight: "bold",
    },
    "& th, & td": {
      fontSize: "16px",
    },
  },
  row: {
    "& *": {
      borderBottom: "unset",
    },
  },
  img: {
    width: "150px",
    height: "150px",
    "& img": {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPosition: "center",
    },
  },
  reviewsDialog: {
    "& .MuiDialog-paperWidthSm": {
      maxWidth: "100%",
      width: "600px",
    },
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortControls: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  formControl: {
    minWidth: 120,
  },
}));
