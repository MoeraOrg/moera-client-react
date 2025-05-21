import React, { useCallback, useEffect, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import deepEqual from 'react-fast-compare';

import { useDebounce } from "ui/hook/misc";

interface UseSuggestionsOptions<L> {
    defaultQuery?: string;
    preprocessQuery?: (query: string) => string | null;
    runQuery: (query: string) => void;
    onSubmit: (query: string | null, success: boolean, result: L | null) => void;
    submitOnEscape?: boolean;
    inputDom: React.RefObject<HTMLInputElement>;
    listDom: React.RefObject<HTMLDivElement>;
}

interface UseSuggestionsResult<L> {
    searchList: L[];
    setSearchList: (list: L[] | ((update: L[]) => L[])) => void;
    selectedIndex: number;
    query: string | null;
    handleKeyDown: (event: React.KeyboardEvent) => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleClick: (index: number) => () => void;
}

/*
 * USER-[handleChange]->query-[debounce]->queryToLoad-[runQuery]->...-[setSearchList]->searchList
 */
export function useSuggestions<L>({
    defaultQuery = "", preprocessQuery, runQuery, onSubmit, submitOnEscape, inputDom, listDom
}: UseSuggestionsOptions<L>): UseSuggestionsResult<L> {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const selectedName = useRef<L | null>(null);
    const [query, setQuery] = useState<string | null>(null);
    const [searchList, setSearchList] = useState<L[]>([]);

    const selectIndex = useCallback((index: number) => {
        setSelectedIndex(index);
        selectedName.current = searchList[index];
        if (listDom.current != null && index >= 0) {
            const item = listDom.current.querySelector(`.item[data-index="${index}"]`);
            if (item != null) {
                setTimeout(() => scrollIntoView(item, {scrollMode: "if-needed", block: "nearest"}));
            }
        }
    }, [listDom, searchList])

    const [queryToLoad] = useDebounce(query, 250);
    useEffect(() => {
        runQuery(queryToLoad ?? "");
    }, [runQuery, queryToLoad]);

    useEffect(() => {
        if (inputDom.current) {
            inputDom.current.focus();
            inputDom.current.select();
        }
        setQuery(defaultQuery);
    }, [defaultQuery, inputDom]);

    useEffect(() =>
        selectIndex(searchList.findIndex(item => deepEqual(item, selectedName.current))),
        [searchList, selectIndex]
    );

    const handleSubmit = (success: boolean, index: number) => {
        if (onSubmit) {
            if (index >= 0 && index < searchList.length) {
                onSubmit(query, success, searchList[index]);
            } else {
                onSubmit(query, success, null);
            }
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case "Escape":
            case "Esc":
                if (submitOnEscape) {
                    handleSubmit(false, -1);
                }
                break;
            case "ArrowUp":
                selectIndex(Math.max(0, selectedIndex - 1));
                break;
            case "ArrowDown":
                selectIndex(Math.min(selectedIndex + 1, searchList.length - 1));
                break;
            case "Enter":
                handleSubmit(true, selectedIndex);
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setQuery(preprocessQuery != null ? preprocessQuery(event.target.value) : event.target.value);

    const handleClick = (index: number) => () => handleSubmit(true, index);

    return {searchList, setSearchList, selectedIndex, query, handleKeyDown, handleChange, handleClick};
}
