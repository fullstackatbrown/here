import { ClickAwayListener, Collapse, IconButton, Input, Stack } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    const [showSearchbar, setShowSearchbar] = useState(false)
    const searchBarRef = useRef(null);

    useEffect(() => {
        // needed to ensure that autofocus is applied after the searchbar is rendered
        if (showSearchbar && searchBarRef.current) {
            searchBarRef.current.focus();
        }
    }, [showSearchbar]);

    return (
        <ClickAwayListener
            onClickAway={() => {
                if (searchQuery === "") setShowSearchbar(false)
            }}>
            <Stack direction="row" alignItems="center">
                <IconButton size="small" onClick={() => setShowSearchbar(true)}>
                    <SearchIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Collapse orientation="horizontal" in={showSearchbar}>
                    <Input
                        placeholder="Type to search"
                        disableUnderline
                        style={{
                            fontSize: 14,
                            padding: 0,
                        }}
                        inputRef={searchBarRef}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Collapse>
            </Stack>
        </ClickAwayListener>
    )
}

export default SearchBar;