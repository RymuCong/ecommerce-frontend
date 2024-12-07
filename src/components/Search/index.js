import { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { SearchTwoTone } from "@material-ui/icons";

export const Search = ({ className, onSearchSubmit }) => {
    const [searchText, setSearchText] = useState("");

    const searchProductsHandler = (e) => {
        e.preventDefault();
        if (!searchText.trim().length) return;
        onSearchSubmit(searchText);
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