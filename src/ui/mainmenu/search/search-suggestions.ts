import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import deepEqual from "react-fast-compare";

import { ClientState } from "state/state";
import { ownerSwitch } from "state/node/actions";
import { contactsPrepare } from "state/contacts/actions";
import { getContacts } from "state/contacts/selectors";
import { goToSearch } from "state/navigation/actions";
import { isAtSearchPage } from "state/navigation/selectors";
import { searchHistoryDelete, searchHistoryPrepare } from "state/search/actions";
import { getSearchQuery } from "state/search/selectors";
import { emptySearchFilter } from "state/search/empty";
import { useSuggestions } from "ui/hook";
import { SearchListItem } from "ui/mainmenu/search/SearchSuggestions";
import { namesListQuery } from "util/names-list";

interface UseSearchSuggestionsResult {
    query: string | null;
    searchList: SearchListItem[];
    selectedIndex: number;
    focused: boolean;
    handleKeyDown: (event: React.KeyboardEvent) => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFocus: () => void;
    handleBlur: () => void;
    handleClear: () => void;
    handleClick: (index: number) => () => void;
    handleHistoryDelete: (index: number) => (event: React.MouseEvent) => void;
    inputDom: React.RefObject<HTMLInputElement>;
    listDom: React.RefObject<HTMLDivElement>;
}

export function useSearchSuggestions(): UseSearchSuggestionsResult {
    const contactNames = useSelector(getContacts);
    const history = useSelector((state: ClientState) => state.search.history);
    const atSearch = useSelector(isAtSearchPage);
    const defaultQuery = useSelector(getSearchQuery);
    const dispatch = useDispatch();

    const [focused, setFocused] = React.useState<boolean>(false);
    const inputBlurTimeout = useRef<number | NodeJS.Timeout | null>(null);
    const inputDom = useRef<HTMLInputElement>(null);
    const listDom = useRef<HTMLDivElement>(null);

    const onInputFocus = () => setFocused(true);

    const onInputBlur = () => {
        inputBlurTimeout.current = setTimeout(() => {
            setFocused(false);
            inputBlurTimeout.current = null;
        }, 200);
    }

    const onSubmit = (success: boolean, item: SearchListItem) => {
        if (success) {
            switch (item.type) {
                case "name":
                    if (item.nodeName != null) {
                        dispatch(ownerSwitch(item.nodeName));
                    }
                    break;
                case "search":
                    inputDom.current?.blur();
                    if (query) {
                        dispatch(goToSearch(query, "content", emptySearchFilter));
                    }
                    break;
                case "history":
                    inputDom.current?.blur();
                    dispatch(goToSearch(item.query, "content", emptySearchFilter));
                    break;
            }
        } else {
            inputDom.current?.blur();
        }
    }

    const {
        searchList, setSearchList, selectedIndex, query, setQuery, handleKeyDown, handleChange, handleClick
    } = useSuggestions<SearchListItem>({
        defaultQuery: atSearch ? defaultQuery : "",
        runQuery: query => {
            dispatch(contactsPrepare(query));
            dispatch(searchHistoryPrepare(query));
        },
        onSubmit: (_, success, result) => onSubmit(success, result ?? {type: "search"}),
        submitOnEscape: true,
        inputDom,
        listDom
    });

    const onClear = () => {
        setQuery("");
        if (inputBlurTimeout.current != null) {
            clearTimeout(inputBlurTimeout.current);
            inputBlurTimeout.current = null;
        }
        inputDom.current?.focus();
    }

    const onHistoryDelete = (index: number) => (event: React.MouseEvent) => {
        const item = searchList[index];
        if (item.type === "history") {
            dispatch(searchHistoryDelete(item.query));
            setSearchList(list => list.toSpliced(index, 1));
        }
        event.stopPropagation();
        event.preventDefault();
    }

    useEffect(() => {
        setSearchList(list => {
            const newList: SearchListItem[] = [];

            const historical = history
                .filter(sh => sh.query.startsWith(query ?? ""))
                .sort((c1, c2) => c2.createdAt - c1.createdAt)
                .map(sh => ({type: "history" as const, query: sh.query}));
            if (historical.length > 3) {
                historical.splice(3);
            }
            newList.push(...historical);

            const names: SearchListItem[] = namesListQuery(
                contactNames.sort((c1, c2) => c1.distance - c2.distance),
                query
            )
                .map(item => ({type: "name" as const, ...item}));
            if (query && names.length > 5) {
                names.splice(5);
            }
            newList.push(...names);

            if (query) {
                newList.push({type: "search" as const});
            }

            return deepEqual(list, newList) ? list : newList;
        });
    }, [contactNames, history, query, setSearchList]);

    return {
        query, searchList, selectedIndex, focused, handleKeyDown, handleChange,
        handleFocus: onInputFocus, handleBlur: onInputBlur, handleClear: onClear, handleClick,
        handleHistoryDelete: onHistoryDelete, inputDom, listDom
    };
}
