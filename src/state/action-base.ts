import { Action } from 'redux';
import { AvatarImage } from "api/node/api-types";

export interface ActionContext {
    ownerName: string | null,
    ownerFullName: string | null,
    homeOwnerName: string | null,
    homeOwnerFullName: string | null,
    homeOwnerAvatar: AvatarImage | null
}

export type WithContext<T> = T & {
    context: ActionContext;
}

export interface ActionWithPayload<T, P> extends Action<T> {
    payload: P;
}
