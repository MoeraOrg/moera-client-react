import { createContext, useContext } from 'react';

import { MaterialSymbol } from "ui/material-symbols";
import { RelNodeName } from "util/rel-node-name";

export interface TextMenuItem {
    show: boolean;
    icon?: MaterialSymbol;
    title: string;
    nodeName: RelNodeName | string;
    href: string;
    onClick?: () => void;
    opensDialog?: boolean;
}

export interface DividerMenuItem {
    divider: boolean;
}

export interface CaptionMenuItem {
    show: boolean;
    caption: string;
}

export type MenuItem = TextMenuItem | DividerMenuItem | CaptionMenuItem;

interface DropdownMenuInterface {
    hide: () => void;
    onDialogOpened?: () => void;
    overlayId: string | undefined;
}

export const DropdownMenuContext = createContext<DropdownMenuInterface>({
    hide: () => {},
    overlayId: undefined
});

export const useDropdownMenu = (): DropdownMenuInterface => useContext(DropdownMenuContext);
