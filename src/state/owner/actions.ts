import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { AvatarImage } from "api/node/api-types";

export const OWNER_LOAD = "OWNER_LOAD";
export type OwnerLoadAction = Action<typeof OWNER_LOAD>;
export const ownerLoad = (): OwnerLoadAction => ({
    type: OWNER_LOAD
});

export const OWNER_SET = "OWNER_SET";
export type OwnerSetAction = ActionWithPayload<typeof OWNER_SET, {
    name: string | null;
    changing: boolean | null;
    fullName: string | null | false;
    gender: string | null | false;
    title: string | null | false;
    avatar: AvatarImage | null;
}>;
export const ownerSet = (name: string | null, changing: boolean | null, fullName: string | null | false,
                         gender: string | null | false, title: string | null | false,
                         avatar: AvatarImage | null): OwnerSetAction => ({
    type: OWNER_SET,
    payload: {name, changing, fullName, gender, title, avatar}
});

export const OWNER_VERIFY = "OWNER_VERIFY";
export type OwnerVerifyAction = Action<typeof OWNER_VERIFY>;
export const ownerVerify = (): OwnerVerifyAction => ({
    type: OWNER_VERIFY
});

export const OWNER_VERIFIED = "OWNER_VERIFIED";
export type OwnerVerifiedLoadAction = ActionWithPayload<typeof OWNER_VERIFIED, {
    name: string;
    correct: boolean;
}>;
export const ownerVerified = (name: string, correct: boolean): OwnerVerifiedLoadAction => ({
    type: OWNER_VERIFIED,
    payload: {name, correct}
});

export const OWNER_SWITCH_OPEN = "OWNER_SWITCH_OPEN";
export type OwnerSwitchOpenAction = Action<typeof OWNER_SWITCH_OPEN>;
export const ownerSwitchOpen = (): OwnerSwitchOpenAction => ({
    type: OWNER_SWITCH_OPEN
});

export const OWNER_SWITCH_CLOSE = "OWNER_SWITCH_CLOSE";
export type OwnerSwitchCloseAction = Action<typeof OWNER_SWITCH_CLOSE>;
export const ownerSwitchClose = (): OwnerSwitchCloseAction => ({
    type: OWNER_SWITCH_CLOSE
});

export const OWNER_SWITCH = "OWNER_SWITCH";
export type OwnerSwitchAction = ActionWithPayload<typeof OWNER_SWITCH, {
    name: string;
}>;
export const ownerSwitch = (name: string): OwnerSwitchAction => ({
    type: OWNER_SWITCH,
    payload: {name}
});

export const OWNER_SWITCH_FAILED = "OWNER_SWITCH_FAILED";
export type OwnerSwitchFailedAction = Action<typeof OWNER_SWITCH_FAILED>;
export const ownerSwitchFailed = (): OwnerSwitchFailedAction => ({
    type: OWNER_SWITCH_FAILED
});

export type OwnerAnyAction =
    OwnerLoadAction
    | OwnerSetAction
    | OwnerVerifyAction
    | OwnerVerifiedLoadAction
    | OwnerSwitchOpenAction
    | OwnerSwitchCloseAction
    | OwnerSwitchAction
    | OwnerSwitchFailedAction;
