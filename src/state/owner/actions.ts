import { Action } from 'redux';

import { ActionWithPayload } from "state/action-base";
import { AvatarImage } from "api/node/api-types";

export const OWNER_LOAD = "OWNER_LOAD";
type OwnerLoadAction = Action<typeof OWNER_LOAD>;
export const ownerLoad = (): OwnerLoadAction => ({
    type: OWNER_LOAD
});

export const OWNER_SET = "OWNER_SET";
type OwnerSetAction = ActionWithPayload<typeof OWNER_SET, {
    name: string;
    changing: boolean;
    fullName: string | null;
    gender: string | null;
    title: string | null;
    avatar: AvatarImage | null;
}>;
export const ownerSet = (name: string, changing: boolean, fullName: string | null, gender: string | null,
                         title: string | null, avatar: AvatarImage | null): OwnerSetAction => ({
    type: OWNER_SET,
    payload: {name, changing, fullName, gender, title, avatar}
});

export const OWNER_VERIFY = "OWNER_VERIFY";
type OwnerVerifyAction = Action<typeof OWNER_VERIFY>;
export const ownerVerify = (): OwnerVerifyAction => ({
    type: OWNER_VERIFY
});

export const OWNER_VERIFIED = "OWNER_VERIFIED";
type OwnerVerifiedLoadAction = ActionWithPayload<typeof OWNER_VERIFIED, {
    name: string;
    correct: boolean;
}>;
export const ownerVerified = (name: string, correct: boolean): OwnerVerifiedLoadAction => ({
    type: OWNER_VERIFIED,
    payload: {name, correct}
});

export const OWNER_SWITCH_OPEN = "OWNER_SWITCH_OPEN";
type OwnerSwitchOpenAction = Action<typeof OWNER_SWITCH_OPEN>;
export const ownerSwitchOpen = (): OwnerSwitchOpenAction => ({
    type: OWNER_SWITCH_OPEN
});

export const OWNER_SWITCH_CLOSE = "OWNER_SWITCH_CLOSE";
type OwnerSwitchCloseAction = Action<typeof OWNER_SWITCH_CLOSE>;
export const ownerSwitchClose = (): OwnerSwitchCloseAction => ({
    type: OWNER_SWITCH_CLOSE
});

export const OWNER_SWITCH = "OWNER_SWITCH";
type OwnerSwitchAction = ActionWithPayload<typeof OWNER_SWITCH, {
    name: string;
}>;
export const ownerSwitch = (name: string): OwnerSwitchAction => ({
    type: OWNER_SWITCH,
    payload: {name}
});

export const OWNER_SWITCH_FAILED = "OWNER_SWITCH_FAILED";
type OwnerSwitchFailedAction = Action<typeof OWNER_SWITCH_FAILED>;
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
