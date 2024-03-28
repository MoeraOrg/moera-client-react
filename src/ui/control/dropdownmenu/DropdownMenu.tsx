import React, { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { useButtonPopper } from "ui/hook";
import { DropdownMenuContext, MenuItem } from "ui/control/dropdownmenu/dropdown-menu-types";
import { DropdownMenuItems } from "ui/control/dropdownmenu/DropdownMenuItems";
import "./DropdownMenu.css";

interface Props {
    content?: ReactNode;
    items?: MenuItem[];
    className?: string | null;
    disabled?: boolean;
    onDialogOpened?: () => void;
    children?: ReactNode;
}

export function DropdownMenu({content, items, className, disabled, onDialogOpened, children}: Props) {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes, zIndex
    } = useButtonPopper("bottom-end");

    const {t} = useTranslation();

    if ((content != null && items != null) || (content == null && items == null)) {
        console.error("DropdownMenu: exactly one of `content` or `items` may be set");
        return null;
    }

    return (
        <DropdownMenuContext.Provider value={{hide, onDialogOpened}}>
            <button className={cx("menu", className)} disabled={disabled} ref={setButtonRef} aria-label={t("menu")}
                    onClick={onToggle}>
                {children ??
                    <FontAwesomeIcon icon={faChevronDown} className="chevron"/>
                }
            </button>
            {visible &&
                <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                     className="fade dropdown-menu shadow-sm show">
                    {content}
                    {items && <DropdownMenuItems items={items}/>}
                </div>
            }
        </DropdownMenuContext.Provider>
    );
}
