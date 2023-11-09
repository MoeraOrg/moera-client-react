import { Action } from 'redux';

import { AvatarImage } from "api";
import { ClientAction } from "state/action";

export interface ActionWithoutPayload<T> extends Action<T> {
    cause: ClientAction | null;
    causedBy: (cause: ClientAction | null) => ActionWithoutPayload<T>;
}

export interface ActionWithPayload<T, P> extends ActionWithoutPayload<T> {
    payload: P;
    causedBy: (cause: ClientAction | null) => ActionWithPayload<T, P>;
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

function causedBy<T, P>(this: ActionWithPayload<T, P>, cause: ClientAction | null): ActionWithPayload<T, P>;
function causedBy<T>(this: ActionWithoutPayload<T>, cause: ClientAction | null): ActionWithoutPayload<T> {
    this.cause = cause;
    return this;
}

export const actionWithoutPayload = <T>(type: T): ActionWithoutPayload<T> =>
    ({type, cause: null, causedBy});

export const actionWithPayload = <T, P>(type: T, payload: P): ActionWithPayload<T, P> =>
    ({type, cause: null, payload, causedBy});
