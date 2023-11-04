import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { CarteInfo } from "api";

export const CARTES_LOAD = "CARTES_LOAD";
export type CartesLoadAction = Action<typeof CARTES_LOAD>;
export const cartesLoad = (): CartesLoadAction => ({
    type: CARTES_LOAD
});

export const CARTES_SET = "CARTES_SET";
export type CartesSetAction = ActionWithPayload<typeof CARTES_SET, {
    cartesIp: string | null;
    cartes: CarteInfo[] | null;
    clockOffset: number | null;
}>;
export const cartesSet = (
    cartesIp: string | null,
    cartes: CarteInfo[] | null,
    clockOffset: number | null
): CartesSetAction => ({
    type: CARTES_SET,
    payload: {cartesIp, cartes, clockOffset}
});

export const CARTES_LOADED = "CARTES_LOADED";
export type CartesLoadedAction = Action<typeof CARTES_LOADED>;
export const cartesLoaded = (): CartesLoadedAction => ({
    type: CARTES_LOADED
});

export const CARTES_PURGE_EXPIRED = "CARTES_PURGE_EXPIRED";
export type CartesPurgeExpiredAction = Action<typeof CARTES_PURGE_EXPIRED>;
export const cartesPurgeExpired = (): CartesPurgeExpiredAction => ({
    type: CARTES_PURGE_EXPIRED
});

export const CLOCK_OFFSET_WARN = "CLOCK_OFFSET_WARN";
export type ClockOffsetWarnAction = Action<typeof CLOCK_OFFSET_WARN>;
export const clockOffsetWarn = (): ClockOffsetWarnAction => ({
    type: CLOCK_OFFSET_WARN
});

export type CartesAnyAction =
    CartesLoadAction
    | CartesSetAction
    | CartesLoadedAction
    | CartesPurgeExpiredAction
    | ClockOffsetWarnAction;
