import { ActionBase } from "state/action-base";

export const POST_INIT = "POST_INIT";
type PostInitAction = ActionBase<typeof POST_INIT, never>;
export const postInit = (): PostInitAction => ({
    type: POST_INIT
});

export const POST_INIT_DELAYED = "POST_INIT_DELAYED";
type PostInitDelayedAction = ActionBase<typeof POST_INIT_DELAYED, never>;
export const postInitDelayed = (): PostInitDelayedAction => ({
    type: POST_INIT_DELAYED
});

export const PULSE_1MIN = "PULSE_1MIN";
type Pulse1MinAction = ActionBase<typeof PULSE_1MIN, never>;
export const pulse1Min = (): Pulse1MinAction => ({
    type: PULSE_1MIN
});

export const PULSE_10MIN = "PULSE_10MIN";
type Pulse10MinAction = ActionBase<typeof PULSE_10MIN, never>;
export const pulse10Min = (): Pulse10MinAction => ({
    type: PULSE_10MIN
});

export const PULSE_6H = "PULSE_6H";
type Pulse6HAction = ActionBase<typeof PULSE_6H, never>;
export const pulse6H = (): Pulse6HAction => ({
    type: PULSE_6H
});

export type PulseAnyAction =
    PostInitAction
    | PostInitDelayedAction
    | Pulse1MinAction
    | Pulse10MinAction
    | Pulse6HAction;
