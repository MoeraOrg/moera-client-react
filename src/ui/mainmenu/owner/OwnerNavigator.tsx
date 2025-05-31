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
import { emptySearchFilter } from "state/search/empty";
import { Button, NameSuggestion } from "ui/control";
import { Icon, msSearch } from "ui/material-symbols";
import { useSuggestions } from "ui/hook/suggestions";
import { NameListItem, namesListQuery } from "util/names-list";
import "./OwnerNavigator.css";

type SearchListItem = {type: "name"} & NameListItem | {type: "search"};

export default function OwnerNavigator() {
    const switching = useSelector((state: ClientState) => state.node.owner.switching);
    const contactNames = useSelector(getContacts);
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
            }
        } else {
            dispatch(ownerSwitchClose());
        }
    }

    const onButtonClick = () => {
        onSubmit(true, {type: "search"});
    }

    const {
        searchList, setSearchList, selectedIndex, query, handleKeyDown, handleChange, handleClick
    } = useSuggestions<SearchListItem>({
        runQuery: query => dispatch(contactsPrepare(query)),
        onSubmit: (_, success, result) => onSubmit(success, result ?? {type: "search"}),
        submitOnEscape: true,
        inputDom,
        listDom
    });

    useEffect(() => {
        setSearchList(list => {
            const newNames: SearchListItem[] = namesListQuery(
                contactNames.sort((c1, c2) => c1.distance - c2.distance),
                query
            )
                .map(item => ({type: "name" as const, ...item}));
            if (query) {
                if (newNames.length > 5) {
                    newNames.splice(5);
                }
                newNames.push({type: "search" as const});
            }
            return deepEqual(list, newNames) ? list : newNames;
        });
    }, [contactNames, query, setSearchList]);

    return (
        <div id="owner-navigator">
            <input type="search" className="form-control" value={query ?? ""} ref={inputDom}
                   onKeyDown={handleKeyDown} onChange={handleChange}/>
            <div className={cx("name-select", {"d-none": searchList.length === 0 && !query})} ref={listDom}>
                {searchList.map((item, index) =>
                    <>
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
                                <div data-index={index}
                                     className={cx("search-item", "item", {"selected": selectedIndex === index})}
                                     onClick={handleClick(index)}
                                >
                                    <div className="icon-cell">
                                        <Icon icon={msSearch} size={20}/>
                                    </div>
                                    <div className="body">
                                        {t("search")}: {query}
                                    </div>
                                </div>
                            </>
                        }
                    </>
                )}
            </div>
            <Button variant="secondary" size="sm" loading={switching} onClick={onButtonClick}>
                <Icon icon={msSearch} size={20}/>
            </Button>
        </div>
    );
}
