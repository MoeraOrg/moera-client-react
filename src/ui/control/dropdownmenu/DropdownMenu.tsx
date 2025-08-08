import React, { ReactNode } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { useButtonPopper } from "ui/hook";
import { DropdownMenuContext, MenuItem } from "ui/control/dropdownmenu/dropdown-menu-types";
import { DropdownMenuItems } from "ui/control/dropdownmenu/DropdownMenuItems";
import { MenuButton } from "ui/control/dropdownmenu/MenuButton";
import { createPortalIfNeeded } from "util/ui";
import "./DropdownMenu.css";

interface Props {
    content?: ReactNode;
    items?: MenuItem[];
    className?: string;
    dropdownClassName?: string;
    disabled?: boolean;
    parentOverlayId?: string;
    menuContainer?: Element | DocumentFragment | null;
    onDialogOpened?: () => void;
    children?: React.ReactNode | ((visible: boolean) => React.ReactNode);
}

export function DropdownMenu({
    content, items, className, dropdownClassName, disabled, parentOverlayId, onDialogOpened, menuContainer, children
}: Props) {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes, zIndex, overlayId
    } = useButtonPopper("bottom-end", {parentOverlayId});

    const {t} = useTranslation();

    if ((content != null && items != null) || (content == null && items == null)) {
        console.error("DropdownMenu: exactly one of `content` or `items` may be set");
        return null;
    }

    return (
        <DropdownMenuContext.Provider value={{hide, onDialogOpened, overlayId}}>
            <button
                type="button"
                className={cx("menu", {active: visible}, className)}
                disabled={disabled}
                ref={setButtonRef}
                aria-label={t("menu")}
                onClick={onToggle}
            >
                {typeof children === "function" ?
                    children(visible)
                :
                    (children ?? <MenuButton active={visible}/>)
                }
            </button>
            {visible && createPortalIfNeeded(
                <div
                    ref={setPopperRef}
                    style={{...popperStyles, zIndex: zIndex?.widget}}
                    {...popperAttributes}
                    className={cx("fade dropdown-menu shadow-sm show", dropdownClassName)}
                >
                    {content}
                    {items && <DropdownMenuItems items={items}/>}
                </div>,
                menuContainer
            )}
        </DropdownMenuContext.Provider>
    );
}
