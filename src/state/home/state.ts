import { AvatarInfo } from "api/node/api-types";
import { RootInfo } from "api/addon/api-types";

export interface HomeState {
    connecting: boolean;
    root: {
        location: string | null;
        page: string | null;
        api: string | null;
        events: string | null;
    };
    login: string | null;
    owner: {
        name: string | null;
        verified: boolean;
        correct: boolean;
        changing: boolean;
    };
    avatars: {
        loading: boolean;
        loaded: boolean;
        avatars: AvatarInfo[];
    };
    addonApiVersion: number | null;
    roots: RootInfo[];
}
