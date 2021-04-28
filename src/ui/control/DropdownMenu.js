import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isStandaloneMode } from "state/navigation/selectors";
import { Browser } from "ui/browser";
import { useButtonPopper } from "ui/hook";
import "./DropdownMenu.css";

function buildItems(items, standalone) {
    const itemList = [];
    let divider = false;
    for (const item of items) {
        if (item.divider) {
            divider = true;
            continue;
        }
        if (!item.show) {
            continue;
        }
        itemList.push({
            title: item.title,
            href: !standalone ? item.href : Browser.passedLocation(item.href),
            onClick: event => {
                item.onClick();
                event.preventDefault();
            },
            divider: divider && itemList.length > 0
        });
        divider = false;
    }
    return itemList;
}

function DropdownMenuImpl({items, standalone}) {
    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes
    } = useButtonPopper("bottom-end");

    const itemList = buildItems(items, standalone);
    return (
        <div className="menu" ref={setButtonRef} onClick={onToggle}>
            <FontAwesomeIcon icon="chevron-down" className="chevron"/>
            {visible &&
                <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                     className="fade dropdown-menu shadow-sm show">
                    {itemList.length > 0 ?
                        itemList.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.divider && <div className="dropdown-divider"/>}
                                <a className="dropdown-item" href={item.href} onClick={item.onClick}>
                                    {item.title}
                                </a>
                            </React.Fragment>
                        ))
                    :
                        <span className="dropdown-item disabled no-actions">No actions</span>
                    }
                </div>
            }
        </div>
    );

}

export const DropdownMenu = connect(
    state => ({
        standalone: isStandaloneMode(state)
    })
)(DropdownMenuImpl);
