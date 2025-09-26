import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, msCancelFilled, msSearch } from "ui/material-symbols";
import { useSearchSuggestions } from "ui/mainmenu/search/search-suggestions";
import SearchSuggestions from "ui/mainmenu/search/SearchSuggestions";
import "./Search.css";

export default function Search() {
    const [focused, setFocused] = React.useState<boolean>(false);
    const inputBlurTimeout = useRef<number | NodeJS.Timeout | null>(null);
    const {t} = useTranslation();

    const onInputFocus = () => setFocused(true);

    const onInputBlur = () => {
        inputBlurTimeout.current = setTimeout(() => {
            setFocused(false);
            inputBlurTimeout.current = null;
        }, 200);
    }

    const {
        query, searchList, selectedIndex, handleKeyDown, handleChange, handleClick, handleClear, handleHistoryDelete,
        inputDom, listDom
    } = useSearchSuggestions();

    return (
        <div id="search-box">
            <Icon icon={msSearch} size={20} className="search-icon"/>
            <input
                type="search"
                className="form-control"
                value={query ?? ""}
                placeholder={t("search")}
                ref={inputDom}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
            />
            {query &&
                <button className="cancel" title={t("clear")} onClick={handleClear} aria-label="Clear search">
                    <Icon icon={msCancelFilled} size={16}/>
                </button>
            }
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
