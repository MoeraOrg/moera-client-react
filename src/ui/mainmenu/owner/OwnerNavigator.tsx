import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import deepEqual from 'react-fast-compare';
import cx from 'classnames';

import { ClientState } from "state/state";
import { ownerSwitch, ownerSwitchClose } from "state/node/actions";
import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import { goToSearch } from "state/navigation/actions";
import { contactsPrepare } from "state/contacts/actions";
import { getContacts } from "state/contacts/selectors";
import { searchHistoryPrepare } from "state/search/actions";
import { emptySearchFilter } from "state/search/empty";
import { NameSuggestion } from "ui/control";
import { Icon, msHistory, msSearch } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import { useSuggestions } from "ui/hook/suggestions";
import { NameListItem, namesListQuery } from "util/names-list";
import { ut } from "util/url";
import "./OwnerNavigator.css";

type SearchListItem = {type: "name"} & NameListItem | {type: "search"} | {type: "history", query: string};

export default function OwnerNavigator() {
    const contactNames = useSelector(getContacts);
    const history = useSelector((state: ClientState) => state.search.history);
    const homeName = useSelector(getHomeOwnerName);
    const homeAvatar = useSelector(getHomeOwnerAvatar);
    const dispatch = useDispatch();
    const {t} = useTranslation();

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
                    dispatch(ownerSwitchClose());
                    if (query) {
                        dispatch(goToSearch(query, "content", emptySearchFilter));
                    }
                    break;
                case "history":
                    dispatch(ownerSwitchClose());
                    dispatch(goToSearch(item.query, "content", emptySearchFilter));
                    break;
            }
        } else {
            dispatch(ownerSwitchClose());
        }
    }

    const onButtonClick = (_: string, performJump: () => void) => {
        dispatch(ownerSwitchClose());
        performJump();
    }

    const {
        searchList, setSearchList, selectedIndex, query, handleKeyDown, handleChange, handleClick
    } = useSuggestions<SearchListItem>({
        runQuery: query => {
            dispatch(contactsPrepare(query));
            dispatch(searchHistoryPrepare(query));
        },
        onSubmit: (_, success, result) => onSubmit(success, result ?? {type: "search"}),
        submitOnEscape: true,
        inputDom,
        listDom
    });

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
            <input type="search" className="form-control" value={query ?? ""} ref={inputDom}
                   onKeyDown={handleKeyDown} onChange={handleChange}/>
            <div className={cx("name-select", {"d-none": searchList.length === 0 && !query})} ref={listDom}>
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
            <Jump href={ut`/search?query=${query}`} className="btn btn-secondary btn-sm"
                  onNear={onButtonClick} onFar={onButtonClick}>
                <Icon icon={msSearch} size={20}/>
            </Jump>
        </div>
    );
}
