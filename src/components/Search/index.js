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
            page: 0,
            size: 10,
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