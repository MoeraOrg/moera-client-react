import { createContext } from "react";
import { RelNodeName } from "util/rel-node-name";

export interface TextMenuItem {
    show: boolean;
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
}

export const DropdownMenuContext = createContext<DropdownMenuInterface>({
    hide: () => {}
});

