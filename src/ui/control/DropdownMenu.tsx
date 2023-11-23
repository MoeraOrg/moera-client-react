import React, { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { useButtonPopper } from "ui/hook";
import Jump from "ui/navigation/Jump";
import "./DropdownMenu.css";

interface TextMenuItem {
    show: boolean;
    title: string;
    nodeName: string | null;
    href: string | null;
    onClick?: () => void;
    opensDialog?: boolean;
}

interface DividerMenuItem {
    divider: boolean;
}

interface CaptionMenuItem {
    show: boolean;
    caption: string;
}

type MenuItem = TextMenuItem | DividerMenuItem | CaptionMenuItem;

function isDivider(item: MenuItem): item is DividerMenuItem {
    return "divider" in item && item.divider;
}

function isCaption(item: MenuItem): item is CaptionMenuItem {
    return "caption" in item;
}

interface RenderedItem {
    title: string;
    nodeName?: string | null;
    href?: string | null;
    onClick?: () => void;
    opensDialog?: boolean;
    divider: boolean;
    caption: boolean;
}

function buildItems(items: MenuItem[]): RenderedItem[] {
    const itemList: RenderedItem[] = [];
    let divider = false;
    for (const item of items) {
        if (isDivider(item)) {
            divider = true;
            continue;
        }
        if (!item.show) {
            continue;
        }
        if (isCaption(item)) {
            itemList.push({
                title: item.caption,
                divider: divider && itemList.length > 0,
                caption: true
            });
        } else {
            itemList.push({
                title: item.title,
                nodeName: item.nodeName,
                href: item.href,
                onClick: item.onClick,
                opensDialog: item.opensDialog,
                divider: divider && itemList.length > 0,
                caption: false
            });
        }
        divider = false;
    }
    return itemList;
}

interface Props {
    items: MenuItem[];
    className?: string | null;
    disabled?: boolean;
    onDialogOpened?: () => void;
    children?: ReactNode;
}

export function DropdownMenu({items, className, disabled, onDialogOpened, children}: Props) {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes
    } = useButtonPopper("bottom-end");
    const {t} = useTranslation();

    const onClick = (item: RenderedItem) => (href: string, performJump: () => void) => {
        hide();
        if (item.onClick != null) {
            if (item.opensDialog && onDialogOpened != null) {
                onDialogOpened();
            }
            item.onClick();
        } else {
            performJump();
        }
    }

    const itemList = buildItems(items);
    return (
        <>
            <button className={cx("menu", className)} disabled={disabled} ref={setButtonRef} onClick={onToggle}>
                {children ??
                    <FontAwesomeIcon icon="chevron-down" className="chevron"/>
                }
            </button>
            {visible &&
                <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                     className="fade dropdown-menu shadow-sm show">
                    {itemList.length > 0 ?
                        itemList.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.divider && <div className="dropdown-divider"/>}
                                {item.caption ?
                                    <div className="caption">{item.title}</div>
                                :
                                    <Jump className="dropdown-item" nodeName={item.nodeName} href={item.href ?? ""}
                                          onNear={onClick(item)} onFar={onClick(item)}>
                                        {item.title}
                                    </Jump>
                                }
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
