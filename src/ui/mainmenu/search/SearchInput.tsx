import React, { ForwardedRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";

import { Icon, msCancelFilled, msSearch } from "ui/material-symbols";
import "./SearchInput.css";

interface Props {
    query: string | null;
    handleKeyDown: (event: React.KeyboardEvent) => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFocus: () => void;
    handleBlur: () => void;
    handleClear: () => void;
}

function SearchInput(
    {query, handleKeyDown, handleChange, handleFocus, handleBlur, handleClear}: Props,
    ref: ForwardedRef<HTMLInputElement>
) {
    const {t} = useTranslation();

    return (
        <>
            <Icon icon={msSearch} size={20} className="search-icon"/>
            <input
                type="search"
                className="form-control"
                value={query ?? ""}
                placeholder={t("search")}
                ref={ref}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {query &&
                <button className="cancel" title={t("clear")} onClick={handleClear} aria-label="Clear search">
                    <Icon icon={msCancelFilled} size={16}/>
                </button>
            }
        </>
    );
}

export default forwardRef(SearchInput);
