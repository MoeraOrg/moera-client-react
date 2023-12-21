import { createContext } from "react";

export interface TextMenuItem {
    show: boolean;
    title: string;
    nodeName: string | null;
    href: string | null;
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

