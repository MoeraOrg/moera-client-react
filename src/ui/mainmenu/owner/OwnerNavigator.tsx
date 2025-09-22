import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import deepEqual from 'react-fast-compare';
import cx from 'classnames';

import { ClientState } from "state/state";
import { ownerSwitch } from "state/node/actions";
import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import { goToSearch } from "state/navigation/actions";
import { isAtSearchPage } from "state/navigation/selectors";
import { contactsPrepare } from "state/contacts/actions";
import { getContacts } from "state/contacts/selectors";
import { searchHistoryDelete, searchHistoryPrepare } from "state/search/actions";
import { emptySearchFilter } from "state/search/empty";
import { getSearchQuery } from "state/search/selectors";
import { NameSuggestion } from "ui/control";
import { Icon, msCancel, msHistory, msSearch } from "ui/material-symbols";
import { useSuggestions } from "ui/hook";
import Jump from "ui/navigation/Jump";
import { NameListItem, namesListQuery } from "util/names-list";
import { ut } from "util/url";
import "./OwnerNavigator.css";

type SearchListItem = {type: "name"} & NameListItem | {type: "search"} | {type: "history", query: string};

export default function OwnerNavigator() {
    const contactNames = useSelector(getContacts);
    const history = useSelector((state: ClientState) => state.search.history);
    const homeName = useSelector(getHomeOwnerName);
    const homeAvatar = useSelector(getHomeOwnerAvatar);
    const atSearch = useSelector(isAtSearchPage);
    const defaultQuery = useSelector(getSearchQuery);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [focused, setFocused] = React.useState<boolean>(false);
    const inputDom = useRef<HTMLInputElement>(null);
    const listDom = useRef<HTMLDivElement>(null);

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
        searchList, setSearchList, selectedIndex, query, handleKeyDown, handleChange, handleClick
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

    const onInputFocus = () => setFocused(true);

    const onInputBlur = () => setTimeout(() => setFocused(false), 200);

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

    return (
        <div id="owner-navigator">
            <Icon icon={msSearch} size={20} className="search-icon"/>
            <input type="search" className="form-control" value={query ?? ""} placeholder={t("search")} ref={inputDom}
                   onKeyDown={handleKeyDown} onChange={handleChange} onFocus={onInputFocus} onBlur={onInputBlur}/>
            <div className={cx("name-select", {"d-none": !focused || (searchList.length === 0 && !query)})}
                 ref={listDom}>
                {searchList.map((item, index) =>
                    <React.Fragment key={index}>
                        {item.type === "history" &&
                            <>
                                <Jump
                                    data-index={index}
                                    className={cx("search-item", "item", {"selected": selectedIndex === index})}
                                    href={ut`/search?query=${item.query}`}
                                    onNear={handleClick(index)} onFar={handleClick(index)}
                                >
                                    <div className="icon-cell">
                                        <Icon icon={msHistory} size={20}/>
                                    </div>
                                    <div className="body">
                                        {item.query}
                                    </div>
                                    <div className="icon-cell" title={t("delete")} onClick={onHistoryDelete(index)}>
                                        <Icon icon={msCancel} size={16}/>
                                    </div>
                                </Jump>
                                {(index + 1 < searchList.length && searchList[index + 1].type === "name") && <hr/>}
                            </>
                        }
                        {item.type === "name" &&
                            <NameSuggestion
                                key={index}
                                className={cx("item", {"selected": index === selectedIndex})}
                                index={index}
                                nodeName={item.nodeName}
                                fullName={item.fullName}
                                avatar={item.nodeName !== homeName ? item.avatar : homeAvatar}
                                onClick={handleClick}
                            />
                        }
                        {item.type === "search" &&
                            <>
                                {searchList.length > 1 && <hr/>}
                                <Jump
                                    data-index={index}
                                    className={cx("search-item", "item", {"selected": selectedIndex === index})}
                                    href={ut`/search?query=${query}`}
                                    onNear={handleClick(index)} onFar={handleClick(index)}
                                >
                                    <div className="icon-cell">
                                        <Icon icon={msSearch} size={20}/>
                                    </div>
                                    <div className="body">
                                        {t("search")}: {query}
                                    </div>
                                </Jump>
                            </>
                        }
                    </React.Fragment>
                )}
            </div>
        </div>
    );
}
