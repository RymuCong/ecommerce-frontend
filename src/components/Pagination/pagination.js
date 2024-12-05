// src/components/Pagination/index.js
import { TablePagination } from "@material-ui/core";
import { useState } from "react";

export const Pagination = ({ total, rowsPerPageOptions, onPageChange, onRowsPerPageChange }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        onPageChange(newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        onRowsPerPageChange(0, newRowsPerPage);
    };

    return (
        <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    );
};