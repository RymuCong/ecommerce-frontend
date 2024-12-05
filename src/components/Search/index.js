import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { SearchTwoTone } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { fetchSearchProducts } from "../../redux/slices/product";

export const Search = ({ className }) => {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");

    const searchProductsHandler = (e) => {
        e.preventDefault();
        if (!searchText.trim().length) return;

        const searchRequestDTO = {
            fields: ["name", "description"], // Adjust fields as needed
            searchTerm: searchText,
            sortBy: "name", // Adjust sortBy as needed
            order: "ASC", // Adjust order as needed
            pageNumber: 0,
            pageSize: 10,
            totalElements: 0, // Default value, will be set by backend
            totalPages: 0, // Default value, will be set by backend
            lastPage: false // Default value, will be set by backend
        };

        dispatch(fetchSearchProducts(searchRequestDTO));
    };

    return (
        <form onSubmit={searchProductsHandler}>
            <TextField
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={className}
                placeholder="Search..."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton type="submit">
                                <SearchTwoTone />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </form>
    );
};