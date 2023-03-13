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

interface TextMenuItem {
    show: boolean;
    title: string;
    href: string | null;
    onClick: () => void;
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
    href?: string | null;
    onClick?: (event: React.MouseEvent) => void;
    opensDialog?: boolean;
    divider: boolean;
    caption: boolean;
}

function buildItems(items: MenuItem[], standalone: boolean): RenderedItem[] {
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
                href: !standalone || item.href == null ? item.href : Browser.passedLocation(item.href),
                onClick: (event: React.MouseEvent) => {
                    item.onClick();
                    event.preventDefault();
                },
                opensDialog: item.opensDialog,
                divider: divider && itemList.length > 0,
                caption: false
            });
        }
        divider = false;
    }
    return itemList;
}

type Props = {
    items: MenuItem[];
    className?: string | null;
    disabled?: boolean;
    onDialogOpened?: () => void;
    children?: ReactNode;
} & ConnectedProps<typeof connector>;

function DropdownMenuImpl({items, className, disabled, onDialogOpened, children, standalone}: Props) {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes
    } = useButtonPopper("bottom-end");
    const {t} = useTranslation();

    const onClick = (item: RenderedItem) => (event: React.MouseEvent) => {
        if (item.onClick != null) {
            hide();
            if (item.opensDialog && onDialogOpened != null) {
                onDialogOpened();
            }
            item.onClick(event);
        }
    }

    const itemList = buildItems(items, standalone);
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
                                    <a className="dropdown-item" href={item.href ?? undefined} onClick={onClick(item)}>
                                        {item.title}
                                    </a>
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

const connector = connect(
    (state: ClientState) => ({
        standalone: isStandaloneMode(state)
    })
);

export const DropdownMenu = connector(DropdownMenuImpl);
