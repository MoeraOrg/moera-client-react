import { Page } from "state/navigation/pages";

export interface NavigationState {
    page: Page;
    location: string;
    title: string;
    canonicalUrl: string | null;
    noIndex: boolean;
    update: boolean;
    locked: boolean;
    bottomMenuVisible: boolean;
}
