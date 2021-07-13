import { Page } from "state/navigation/pages";

export interface NavigationState {
    standalone: boolean;
    page: Page;
    location: string;
    title: string;
    update: boolean;
    locked: boolean;
    bottomMenuVisible: boolean;
    closeDialogAction: any;
}
