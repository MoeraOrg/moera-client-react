import { AvatarImage } from "api/node/api-types";

export interface OwnerState {
    name: string | null;
    fullName: string | null;
    gender: string | null;
    title: string | null;
    avatar: AvatarImage | null;
    correct: boolean;
    verified: boolean;
    verifiedAt: number;
    changing: boolean;
    showNavigator: boolean;
    switching: boolean;
}
