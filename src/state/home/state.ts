import { AvatarInfo, BlockedUserInfo, FriendGroupInfo } from "api";
import { RootInfo } from "storage";

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
    roots: RootInfo[];
    friendGroups: FriendGroupInfo[];
    invisibleUsers: {
        checksum: number;
        blockedUsers: BlockedUserInfo[];
    }
}
