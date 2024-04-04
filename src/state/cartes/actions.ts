import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { CarteInfo } from "api";

export type CartesLoadAction = ActionWithoutPayload<"CARTES_LOAD">;
export const cartesLoad = (): CartesLoadAction =>
    actionWithoutPayload("CARTES_LOAD");

export type CartesSetAction = ActionWithPayload<"CARTES_SET", {
    cartesIp: string | null;
    cartes: CarteInfo[] | null;
    clockOffset: number | null;
}>;
export const cartesSet = (
    cartesIp: string | null, cartes: CarteInfo[] | null, clockOffset: number | null
): CartesSetAction =>
    actionWithPayload("CARTES_SET", {cartesIp, cartes, clockOffset});

export type CartesLoadedAction = ActionWithoutPayload<"CARTES_LOADED">;
export const cartesLoaded = (): CartesLoadedAction =>
    actionWithoutPayload("CARTES_LOADED");

export type CartesPurgeExpiredAction = ActionWithoutPayload<"CARTES_PURGE_EXPIRED">;
export const cartesPurgeExpired = (): CartesPurgeExpiredAction =>
    actionWithoutPayload("CARTES_PURGE_EXPIRED");

export type CartesUpdateServiceWorkerAction = ActionWithoutPayload<"CARTES_UPDATE_SERVICE_WORKER">;
export const cartesUpdateServiceWorker = (): CartesUpdateServiceWorkerAction =>
    actionWithoutPayload("CARTES_UPDATE_SERVICE_WORKER");

export type ClockOffsetWarnAction = ActionWithoutPayload<"CLOCK_OFFSET_WARN">;
export const clockOffsetWarn = (): ClockOffsetWarnAction =>
    actionWithoutPayload("CLOCK_OFFSET_WARN");

export type CartesAnyAction =
    CartesLoadAction
    | CartesSetAction
    | CartesLoadedAction
    | CartesPurgeExpiredAction
    | CartesUpdateServiceWorkerAction
    | ClockOffsetWarnAction;
