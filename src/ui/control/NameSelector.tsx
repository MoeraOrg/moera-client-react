import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { createSelector } from 'reselect';
import cloneDeep from 'lodash.clonedeep';
import deepEqual from 'react-fast-compare';
import scrollIntoView from 'scroll-into-view-if-needed';

import { NodeName } from "api";
import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import { contactsPrepare } from "state/contacts/actions";
import { getContacts } from "state/contacts/selectors";
import { getNamesInComments } from "state/detailedposting/selectors";
import { useDebounce } from "ui/hook";
import { Avatar } from "ui/control/Avatar";
import { mentionName } from "util/names";
import { NameListItem, namesListQuery } from "util/names-list";
import "./NameSelector.css";

interface Props {
    defaultQuery?: string;
    onChange?: (query: string | null) => void;
    onSubmit: (success: boolean, result: NameListItem) => void;
    submitOnEscape?: boolean;
}

export function NameSelector({defaultQuery = "", onChange, onSubmit, submitOnEscape = false}: Props) {
    const contactNames = useSelector(getNames);
    const homeName = useSelector(getHomeOwnerName);
    const homeAvatar = useSelector(getHomeOwnerAvatar);
    const dispatch = useDispatch();

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const selectedName = useRef<string | null>(null);
    const [names, setNames] = useState<NameListItem[]>([]);
    const [query, setQuery] = useState<string | null>(null);
    const [searchList, setSearchList] = useState<NameListItem[]>([]);

    const inputDom = useRef<HTMLInputElement>(null);
    const listDom = useRef<HTMLDivElement>(null);

    const selectIndex = useCallback((index: number) => {
        setSelectedIndex(index);
        selectedName.current = searchList[index]?.nodeName;
        if (listDom.current != null && index >= 0) {
            const item = listDom.current.querySelector(`.item[data-index="${index}"]`);
            if (item != null) {
                setTimeout(() => scrollIntoView(item, {scrollMode: "if-needed", block: "nearest"}));
            }
        }
    }, [listDom, searchList])

    const [queryToLoad] = useDebounce(query, 500);
    useEffect(() => {
        dispatch(contactsPrepare(queryToLoad ?? ""));
    }, [dispatch, queryToLoad]);

    useEffect(() => {
        if (inputDom.current) {
            inputDom.current.focus();
            inputDom.current.select();
        }
        setQuery(defaultQuery);
    }, [defaultQuery, inputDom]);

    useEffect(() => {
        setNames(names => {
            const newNames = namesListQuery(contactNames, query);
            return deepEqual(names, newNames) ? names : newNames;
        });
        if (onChange) {
            onChange(query);
        }
    }, [contactNames, onChange, query]);

    useEffect(() =>
        setSearchList(reorderNames(names, query)),
        [names, query]
    );

    useEffect(() =>
        selectIndex(searchList.findIndex(item => item.nodeName === selectedName.current)),
        [searchList, selectIndex]
    );

    const handleSubmit = (success: boolean, index: number) => {
        if (onSubmit) {
            if (index >= 0 && index < searchList.length) {
                onSubmit(success, searchList[index]);
            } else {
                onSubmit(success, {nodeName: query, fullName: null});
            }
        }
    }

    const handleClose = () => {
        if (submitOnEscape) {
            handleSubmit(false, -1);
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
            case "Escape":
            case "Esc":
                handleClose();
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setQuery(trimQuery(event.target.value));

    const handleClick = (index: number) => () => handleSubmit(true, index);

    return (
        <>
            <input type="search" className="form-control" value={query ?? defaultQuery} ref={inputDom}
                   onKeyDown={handleKeyDown} onChange={handleChange}/>
            <div className={cx("name-select", {"d-none": searchList.length === 0})} ref={listDom}>
                {searchList.map((item, index) =>
                    <div key={index} data-index={index}
                         className={cx("item", {"selected": index === selectedIndex})}
                         onClick={handleClick(index)}>
                        <Avatar avatar={item.nodeName !== homeName ? item.avatar : homeAvatar} ownerName={item.nodeName}
                                size={40}/>
                        <div className="body">
                            <div className="full-name">{item.fullName || NodeName.shorten(item.nodeName)}</div>
                            <div className="name">{mentionName(item.nodeName)}</div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function trimQuery(text: string | null | undefined): string | null {
    if (text == null) {
        return null;
    }
    return text.startsWith("@") ? text.substring(1) : text;
}

function reorderNames(names: NameListItem[], query: string | null): NameListItem[] {
    if (!query) {
        return names;
    }
    const index = names.findIndex(nm => nm.nodeName === query);
    if (index < 0) {
        return [{nodeName: query}, ...names];
    }
    if (index === 0) { // Already at the first place
        return names;
    }
    const list = names.slice();
    const t = list.splice(index, 1);
    list.unshift(...t);
    return list;
}

const getNames = createSelector(
    [getContacts, getNamesInComments],
    (contacts, usedNames) => {
        const contactNames = new Set(contacts.map(c => c.nodeName));
        const usedNamesMap = new Map(usedNames.map(c => [c.nodeName, c]));
        const result = cloneDeep(contacts);
        for (const c of result) {
            if (usedNamesMap.has(c.nodeName)) {
                c.distance -= usedNamesMap.get(c.nodeName)!.count / 100;
            }
        }
        usedNames
            .filter(c => !contactNames.has(c.nodeName))
            .map(({nodeName, fullName, avatar, count}) => ({nodeName, fullName, avatar, distance: 3 - count / 100}))
            .forEach(c => result.push(c));
        result.sort((c1, c2) => c1.distance - c2.distance);
        return result;
    }
);
