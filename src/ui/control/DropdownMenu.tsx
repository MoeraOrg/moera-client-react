import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ClientState } from "state/state";
import { isStandaloneMode } from "state/navigation/selectors";
import { Browser } from "ui/browser";
import { useButtonPopper } from "ui/hook";
import "./DropdownMenu.css";

type TextMenuItem = {
    show: boolean;
    title: string;
    href: string;
    onClick: () => void;
};

type DividerMenuItem = {
    divider: boolean;
};

type MenuItem = TextMenuItem | DividerMenuItem;

function isDivider(item: MenuItem): item is DividerMenuItem {
    return "divider" in item && item.divider;
}

function buildItems(items: MenuItem[], standalone: boolean) {
    const itemList = [];
    let divider = false;
    for (const item of items) {
        if (isDivider(item)) {
            divider = true;
            continue;
        }
        if (!item.show) {
            continue;
        }
        itemList.push({
            title: item.title,
            href: !standalone ? item.href : Browser.passedLocation(item.href),
            onClick: (event: React.MouseEvent) => {
                item.onClick();
                event.preventDefault();
            },
            divider: divider && itemList.length > 0
        });
        divider = false;
    }
    return itemList;
}

type Props = {
    items: MenuItem[];
} & ConnectedProps<typeof connector>;

function DropdownMenuImpl({items, standalone}: Props) {
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

const connector = connect(
    (state: ClientState) => ({
        standalone: isStandaloneMode(state)
    })
);

export const DropdownMenu = connector(DropdownMenuImpl);
