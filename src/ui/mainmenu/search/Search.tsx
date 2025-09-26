import React from 'react';

import { useSearchSuggestions } from "ui/mainmenu/search/search-suggestions";
import SearchInput from "ui/mainmenu/search/SearchInput";
import SearchSuggestions from "ui/mainmenu/search/SearchSuggestions";
import "./Search.css";

export default function Search() {
    const {
        query, searchList, selectedIndex, focused, handleKeyDown, handleChange, handleFocus, handleBlur, handleClear,
        handleClick, handleHistoryDelete, inputDom, listDom
    } = useSearchSuggestions();

    return (
        <div id="search-box">
            <SearchInput
                query={query}
                handleKeyDown={handleKeyDown}
                handleChange={handleChange}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
                handleClear={handleClear}
                ref={inputDom}
            />
            <SearchSuggestions
                query={query}
                searchList={searchList}
                selectedIndex={selectedIndex}
                handleClick={handleClick}
                onHistoryDelete={handleHistoryDelete}
                visible={focused && (searchList.length > 0 || !!query)}
                ref={listDom}
            />
        </div>
    );
}
