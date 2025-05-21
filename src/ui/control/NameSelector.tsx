import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { createSelector } from 'reselect';
import cloneDeep from 'lodash.clonedeep';
import deepEqual from 'react-fast-compare';

import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import { contactsPrepare } from "state/contacts/actions";
import { getContacts } from "state/contacts/selectors";
import { getNamesInComments } from "state/detailedposting/selectors";
import { useSuggestions } from "ui/hook/suggestions";
import { NameSuggestion } from "ui/control/NameSuggestion";
import { nameListInsertFirst, NameListItem, namesListQuery } from "util/names-list";
import "./NameSelector.css";

interface Props {
    defaultQuery?: string;
    onChange?: (query: string | null) => void;
    onSubmit: (success: boolean, result: NameListItem) => void;
}

/*
 * USER-[handleChange]->...->[runQuery]->REDUX
 * REDUX-[getNames]->contactNames-[namesListQuery]->names-[reorderNames]->searchList->RENDER
 */
export function NameSelector({defaultQuery = "", onChange, onSubmit}: Props) {
    const contactNames = useSelector(getNames);
    const homeName = useSelector(getHomeOwnerName);
    const homeAvatar = useSelector(getHomeOwnerAvatar);
    const dispatch = useDispatch();

    const inputDom = useRef<HTMLInputElement>(null);
    const listDom = useRef<HTMLDivElement>(null);

    const {
        searchList, setSearchList, selectedIndex, query, handleKeyDown, handleChange, handleClick
    } = useSuggestions<NameListItem>({
        defaultQuery,
        preprocessQuery: trimQuery,
        runQuery: query => dispatch(contactsPrepare(query)),
        onSubmit: (query, success, result) => onSubmit(success, result ?? {nodeName: query, fullName: ""}),
        submitOnEscape: false,
        inputDom,
        listDom
    });

    useEffect(() => {
        setSearchList(list => {
            const newNames = nameListInsertFirst(namesListQuery(contactNames, query), query);
            return deepEqual(list, newNames) ? list : newNames;
        });
        if (onChange) {
            onChange(query);
        }
    }, [contactNames, onChange, query, setSearchList]);

    return (
        <>
            <input type="search" className="form-control" value={query ?? defaultQuery} ref={inputDom}
                   onKeyDown={handleKeyDown} onChange={handleChange}/>
            <div className={cx("name-select", {"d-none": searchList.length === 0})} ref={listDom}>
                {searchList.map((item, index) =>
                    <NameSuggestion
                        key={index}
                        className={cx("item", {"selected": index === selectedIndex})}
                        index={index}
                        nodeName={item.nodeName}
                        fullName={item.fullName}
                        avatar={item.nodeName !== homeName ? item.avatar : homeAvatar}
                        onClick={handleClick}
                    />
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
