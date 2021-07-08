import { ActionBase } from "state/action-base";
import { CarteInfo } from "api/node/api-types";

export const CARTES_LOAD = "CARTES_LOAD";
type CartesLoadAction = ActionBase<typeof CARTES_LOAD, never>;
export const cartesLoad = (): CartesLoadAction => ({
    type: CARTES_LOAD
});

export const CARTES_SET = "CARTES_SET";
type CartesSetAction = ActionBase<typeof CARTES_SET, {
    cartesIp: string;
    cartes: CarteInfo[];
    clockOffset: number;
}>;
export const cartesSet = (cartesIp: string, cartes: CarteInfo[], clockOffset: number): CartesSetAction => ({
    type: CARTES_SET,
    payload: {cartesIp, cartes, clockOffset}
});

export const CARTES_PURGE_EXPIRED = "CARTES_PURGE_EXPIRED";
type CartesPurgeExpiredAction = ActionBase<typeof CARTES_PURGE_EXPIRED, never>;
export const cartesPurgeExpired = (): CartesPurgeExpiredAction => ({
    type: CARTES_PURGE_EXPIRED
});

export const CLOCK_OFFSET_WARN = "CLOCK_OFFSET_WARN";
type ClockOffsetWarnAction = ActionBase<typeof CLOCK_OFFSET_WARN, never>;
export const clockOffsetWarn = (): ClockOffsetWarnAction => ({
    type: CLOCK_OFFSET_WARN
});

export type CartesAnyAction =
    CartesLoadAction
    | CartesSetAction
    | CartesPurgeExpiredAction
    | ClockOffsetWarnAction;
