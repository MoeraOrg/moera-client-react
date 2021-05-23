import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';
import { createSelector } from 'reselect';
import cloneDeep from 'lodash.clonedeep';
import deepEqual from 'react-fast-compare';
import debounce from 'lodash.debounce';
import scrollIntoView from 'scroll-into-view-if-needed';

import { NodeName } from "api";
import { contactsPrepare } from "state/contacts/actions";
import { getContacts } from "state/contacts/selectors";
import { getNamesInComments } from "state/detailedposting/selectors";
import { Avatar } from "ui/control/Avatar";
import { mentionName } from "util/misc";
import { namesListQuery } from "util/names-list";
import "./NameSelector.css";
import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";

function NameSelectorImpl({defaultQuery, onChange, onSubmit, contactNames, homeName, homeAvatar, contactsPrepare}) {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [names, setNames] = useState([]);
    const [query, setQuery] = useState(null);

    const inputDom = useRef();
    const listDom = useRef();

    const selectIndex = useCallback(index => {
        setSelectedIndex(index);
        if (listDom.current && index >= 0) {
            const item = listDom.current.querySelector(`.item[data-index="${index}"]`);
            if (item != null) {
                scrollIntoView(item, {scrollMode: "if-needed", block: "nearest"});
            }
        }
    }, [listDom])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadContacts = useCallback(debounce(() => {
        contactsPrepare(query);
    }, 500), [contactsPrepare]);

    useEffect(() => {
        if (inputDom.current) {
            inputDom.current.focus();
            inputDom.current.select();
        }
        setQuery(defaultQuery);
    }, [defaultQuery, inputDom, selectIndex]);

    useEffect(() => {
        selectIndex(-1);
        setNames(names => {
            const newNames = namesListQuery(contactNames, query);
            return deepEqual(names, newNames) ? names : newNames;
        })
        if (onChange) {
            onChange(query);
        }
        loadContacts();
    }, [contactNames, loadContacts, onChange, query, selectIndex]);

    const handleSubmit = (success, index) => {
        if (onSubmit) {
            if (index >= 0 && index < names.length) {
                onSubmit(success, names[index]);
            } else {
                onSubmit(success, {nodeName: query});
            }
        }
    }

    const handleClose = () => handleSubmit(false, -1);

    const handleKeyDown = event => {
        switch (event.key) {
            case "Escape":
            case "Esc":
                handleClose();
                break;
            case "ArrowUp":
                selectIndex(Math.max(0, selectedIndex - 1));
                break;
            case "ArrowDown":
                selectIndex(Math.min(selectedIndex + 1, names.length - 1));
                break;
            case "Enter":
                handleSubmit(true, selectedIndex);
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    const handleChange = event => setQuery(event.target.value);

    const handleClick = index => () => handleSubmit(true, index);

    return (
        <>
            <input type="text" className="form-control" value={query ?? defaultQuery} ref={inputDom}
                   onKeyDown={handleKeyDown} onChange={handleChange}/>
            <div className={cx("name-select", {"d-none": names.length === 0})} ref={listDom}>
                {names.map((item, index) =>
                    <div key={index} data-index={index}
                         className={cx("item", {"selected": index === selectedIndex})}
                         onClick={handleClick(index)}>
                        <Avatar avatar={item.nodeName !== homeName ? item.avatar : homeAvatar} size={40}/>
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

const getNames = createSelector(
    [getContacts, getNamesInComments],
    (contacts, comments) => {
        const contactNames = new Set(contacts.map(c => c.nodeName));
        const commentMap = new Map(comments.map(c => [c.nodeName, c]));
        const result = cloneDeep(contacts);
        for (const c of result) {
            if (commentMap.has(c.nodeName)) {
                c.closeness += 1000 * commentMap.get(c.nodeName).count;
            }
        }
        comments
            .filter(c => !contactNames.has(c.nodeName))
            .map(({nodeName, fullName, avatar, count}) => ({nodeName, fullName, avatar, closeness: count * 1000}))
            .forEach(c => result.push(c));
        result.sort((c1, c2) => c2.closeness - c1.closeness);
        return result;
    }
);

export const NameSelector = connect(
    state => ({
        contactNames: getNames(state),
        homeName: getHomeOwnerName(state),
        homeAvatar: getHomeOwnerAvatar(state)
    }),
    { contactsPrepare }
)(NameSelectorImpl);

NameSelector.propTypes = {
    defaultQuery: PropType.string,
    onChange: PropType.func,
    onSubmit: PropType.func
}

NameSelector.defaultProps = {
    defaultQuery: ""
}
