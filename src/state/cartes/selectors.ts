import { now } from "util/misc";
import { CarteInfo } from "api/node/api-types";
import { ClientState } from "state/state";

const CLOCK_OFFSET_THRESHOLD = 10 * 60; // seconds

export function getCartesListTtl(cartes: CarteInfo[] | null): number {
    if (!cartes) {
        return -now();
    }
    try {
        const latest = cartes.reduce(
            (latest, carte) => latest > carte.deadline ? latest : carte.deadline, 0
        );
        return latest - now();
    } catch (e) {
        return -now();
    }
}

export function getCartesTtl(state: ClientState): number {
    return getCartesListTtl(state.cartes.cartes);
}

export function isCartesToBeUpdated(state: ClientState): boolean {
    return getCartesTtl(state) < 30 * 60;
}

export function getCurrentCarte(state: ClientState): string | null {
    const current = now();
    const carte = state.cartes.cartes.find(carte => carte.beginning <= current && carte.deadline >= current);
    return carte ? carte.carte : null;
}

export function isCartesRunOut(state: ClientState): boolean {
    return getCurrentCarte(state) == null;
}

export function isCartesInitialized(state: ClientState): boolean {
    return state.cartes.initialized;
}

export function isCartesIpChanged(state: ClientState): boolean {
    return state.cartes.clientIp != null && state.cartes.cartesIp != null
        && state.cartes.clientIp !== state.cartes.cartesIp;
}

export function isClockOffsetToBeWarned(state: ClientState): boolean {
    return isCartesInitialized(state) && Math.abs(state.cartes.clockOffset) > CLOCK_OFFSET_THRESHOLD
        && !state.cartes.clockOffsetWarned;
}
