import { Action } from 'redux';

import { AvatarImage } from "api";
import { ClientAction } from "state/action";

export interface ActionWithoutPayload<T> extends Action<T> {
    cause?: ClientAction;
    causedBy: <T>(cause: ClientAction) => ActionWithoutPayload<T>;
}

export interface ActionWithPayload<T, P> extends ActionWithoutPayload<T> {
    payload: P;
    causedBy: <T, P>(cause: ClientAction) => ActionWithPayload<T, P>;
}

export interface ActionContext {
    ownerName: string | null,
    ownerNameOrUrl: string,
    ownerFullName: string | null,
    homeOwnerName: string | null,
    homeOwnerNameOrUrl: string,
    homeOwnerFullName: string | null,
    homeOwnerGender: string | null,
    homeOwnerAvatar: AvatarImage | null
}

export type WithContext<T extends Action> = T & {
    context: ActionContext;
}

function causedBy<T, P>(this: ActionWithPayload<T, P>, cause: ClientAction): ActionWithPayload<T, P>;
function causedBy<T>(this: ActionWithoutPayload<T>, cause: ClientAction): ActionWithoutPayload<T> {
    this.cause = cause;
    return this;
}

export const actionWithoutPayload = <T>(type: T): ActionWithoutPayload<T> => ({type, causedBy});

export const actionWithPayload = <T, P>(type: T, payload: P): ActionWithPayload<T, P> => ({type, payload, causedBy});
