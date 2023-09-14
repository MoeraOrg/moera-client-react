import { Action } from 'redux';

import { AvatarImage } from "api";

export interface ActionContext {
    ownerName: string | null,
    ownerNameOrUrl: string,
    ownerFullName: string | null,
    homeOwnerName: string | null,
    homeOwnerNameOrUrl: string,
    homeOwnerFullName: string | null,
    homeOwnerAvatar: AvatarImage | null
}

export type WithContext<T> = T & {
    context: ActionContext;
}

export interface ActionWithPayload<T, P> extends Action<T> {
    payload: P;
}
