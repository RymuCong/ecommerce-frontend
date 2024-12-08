import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(3),
    },
    heading: {
        marginBottom: theme.spacing(3),
    },
    form: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 600,
        padding: theme.spacing(3),
    },
    textField: {
        marginBottom: theme.spacing(2),
    },
    addressField: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(2),
    },
}));