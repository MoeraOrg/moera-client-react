import { AvatarImage, AvatarInfo } from "api/node/api-types";

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
        fullName: string | null;
        avatar: AvatarImage | null;
        verified: boolean;
        correct: boolean;
        changing: boolean;
    };
    avatars: {
        loading: boolean;
        loaded: boolean;
        avatars: AvatarInfo[];
    };
    addonApiVersion: number;
    roots: string[];
}
