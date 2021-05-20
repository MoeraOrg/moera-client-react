import React, { useCallback, useEffect, useState } from 'react';
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
import { mentionName } from "util/misc";
import { namesListQuery } from "util/names-list";
import "./NameSelector.css";

function NameSelectorImpl({defaultQuery, onChange, onSubmit, contactNames, contactsPrepare}) {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [names, setNames] = useState([]);
    const [query, setQuery] = useState(null);

    const [inputDom, setInputDom] = useState(null);
    const [listDom, setListDom] = useState(null);

    const selectIndex = useCallback(index => {
        setSelectedIndex(index);
        if (listDom && index >= 0) {
            const item = listDom.querySelector(`.item[data-index="${index}"]`);
            if (item != null) {
                scrollIntoView(item, {scrollMode: "if-needed", block: "nearest"});
            }
        }
    }, [listDom])

    const loadContacts = debounce(() => {
        contactsPrepare(query);
    }, 500);

    useEffect(() => {
        if (inputDom) {
            inputDom.focus();
            inputDom.select();
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
            <input type="text" className="form-control" value={query ?? defaultQuery} ref={setInputDom}
                   onKeyDown={handleKeyDown} onChange={handleChange}/>
            <div className={cx("name-select", {"d-none": names.length === 0})} ref={setListDom}>
                {names.map((item, index) =>
                    <div key={index} data-index={index}
                         className={cx("item", {"selected": index === selectedIndex})}
                         onClick={handleClick(index)}>
                        <div className="full-name">{item.fullName || NodeName.shorten(item.nodeName)}</div>
                        <div className="name">{mentionName(item.nodeName)}</div>
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
            .map(({nodeName, fullName, count}) => ({nodeName, fullName, closeness: count * 1000}))
            .forEach(c => result.push(c));
        result.sort((c1, c2) => c2.closeness - c1.closeness);
        return result;
    }
);

export const NameSelector = connect(
    state => ({
        contactNames: getNames(state)
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
