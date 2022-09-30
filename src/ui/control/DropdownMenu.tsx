import React, { ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isStandaloneMode } from "state/navigation/selectors";
import { Browser } from "ui/browser";
import { useButtonPopper } from "ui/hook";
import "./DropdownMenu.css";

type TextMenuItem = {
    show: boolean;
    title: string;
    href: string | null;
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
            href: !standalone || item.href == null ? item.href : Browser.passedLocation(item.href),
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
    caption?: string | null;
    items: MenuItem[];
    className?: string | null;
    children?: ReactNode;
} & ConnectedProps<typeof connector>;

function DropdownMenuImpl({caption, items, className, children, standalone}: Props) {
    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes
    } = useButtonPopper("bottom-end");
    const {t} = useTranslation();

    const itemList = buildItems(items, standalone);
    return (
        <>
            <button className={cx("menu", className)} ref={setButtonRef} onClick={onToggle}>
                {children ??
                    <FontAwesomeIcon icon="chevron-down" className="chevron"/>
                }
            </button>
            {visible &&
                <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                     className="fade dropdown-menu shadow-sm show">
                    {caption && <div className="caption">{caption}</div>}
                    {itemList.length > 0 ?
                        itemList.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.divider && <div className="dropdown-divider"/>}
                                <a className="dropdown-item" href={item.href ?? undefined} onClick={item.onClick}>
                                    {item.title}
                                </a>
                            </React.Fragment>
                        ))
                    :
                        <span className="dropdown-item disabled no-actions">{t("no-actions")}</span>
                    }
                </div>
            }
        </>
    );

}

const connector = connect(
    (state: ClientState) => ({
        standalone: isStandaloneMode(state)
    })
);

export const DropdownMenu = connector(DropdownMenuImpl);
