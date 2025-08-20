import { Page } from "state/navigation/pages";

export interface NavigationStackItem {
    url: string;
    nodeName: string;
    location: string;
    backTitle: string;
}

export interface NavigationState {
    page: Page;
    location: string;
    title: string;
    backTitle: string;
    canonicalUrl: string | null;
    noIndex: boolean;
    create: boolean;
    locked: boolean;
    bottomMenuVisible: boolean;
    stack: NavigationStackItem[];
}
