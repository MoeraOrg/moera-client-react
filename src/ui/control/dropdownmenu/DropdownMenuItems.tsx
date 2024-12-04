import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Jump from "ui/navigation/Jump";
import {
    CaptionMenuItem,
    DividerMenuItem,
    MenuItem,
    useDropdownMenu
} from "ui/control/dropdownmenu/dropdown-menu-types";
import { RelNodeName } from "util/rel-node-name";

function isDivider(item: MenuItem): item is DividerMenuItem {
    return "divider" in item && item.divider;
}

function isCaption(item: MenuItem): item is CaptionMenuItem {
    return "caption" in item;
}

interface RenderedItem {
    title: string;
    nodeName?: RelNodeName | string;
    href?: string;
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
}

export function DropdownMenuItems({items}: Props) {
    const {t} = useTranslation();
    const {hide, onDialogOpened} = useDropdownMenu();

    const onClick = (item: RenderedItem) => (_: string, performJump: () => void) => {
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

    const itemList = useMemo(() => buildItems(items), [items]);

    return (
        <>
            {itemList.length > 0 ?
                itemList.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.divider && <div className="dropdown-divider"/>}
                        {item.caption ?
                            <div className="caption">{item.title}</div>
                        :
                            <Jump className="dropdown-item" nodeName={item.nodeName} href={item.href ?? "/"}
                                  onNear={onClick(item)} onFar={onClick(item)}>
                                {item.title}
                            </Jump>
                        }
                    </React.Fragment>
                ))
            :
                <span className="dropdown-item disabled no-actions">{t("no-actions")}</span>
            }
        </>
    );
}
