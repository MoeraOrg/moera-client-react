import { actionWithoutPayload, ActionWithoutPayload } from "state/action-types";

export type PostInitAction = ActionWithoutPayload<"POST_INIT">;
export const postInit = (): PostInitAction =>
    actionWithoutPayload("POST_INIT");

export type PostInitDelayedAction = ActionWithoutPayload<"POST_INIT_DELAYED">;
export const postInitDelayed = (): PostInitDelayedAction =>
    actionWithoutPayload("POST_INIT_DELAYED");

export type Pulse1MinAction = ActionWithoutPayload<"PULSE_1MIN">;
export const pulse1Min = (): Pulse1MinAction =>
    actionWithoutPayload("PULSE_1MIN");

export type Pulse10MinAction = ActionWithoutPayload<"PULSE_10MIN">;
export const pulse10Min = (): Pulse10MinAction =>
    actionWithoutPayload("PULSE_10MIN");

export type Pulse6HAction = ActionWithoutPayload<"PULSE_6H">;
export const pulse6H = (): Pulse6HAction =>
    actionWithoutPayload("PULSE_6H");

export type PulseAnyAction =
    PostInitAction
    | PostInitDelayedAction
    | Pulse1MinAction
    | Pulse10MinAction
    | Pulse6HAction;
