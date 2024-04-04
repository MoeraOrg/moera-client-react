import { CarteInfo } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { now } from "util/misc";

const CLOCK_OFFSET_THRESHOLD = 10 * 60; // seconds

export function getCartesListTtl(cartes: CarteInfo[] | null | undefined): number {
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

function isAllCarte(carte: CarteInfo): boolean {
    return carte.permissions == null || carte.permissions.includes("other");
}

function isViewMediaCarte(carte: CarteInfo): boolean {
    return carte.permissions != null && carte.permissions.length === 1 && carte.permissions[0] === "view-media";
}

export function getViewMediaCartes(state: ClientState): CarteInfo[] {
    return state.cartes.cartes.filter(isViewMediaCarte);
}

function getCurrentCarte(state: ClientState, filter: (carte: CarteInfo) => boolean): string | null {
    const current = now() - (getSetting(state, "clock.offset") as number) * 60 * 60;
    const carte = state.cartes.cartes
        .find(carte => carte.beginning <= current && carte.deadline >= current && filter(carte));
    return carte ? carte.carte : null;
}

export function getCurrentAllCarte(state: ClientState): string | null {
    return getCurrentCarte(state, isAllCarte);
}

export function getCurrentViewMediaCarte(state: ClientState): string | null {
    return getCurrentCarte(state, isViewMediaCarte);
}

export function isCartesInitialized(state: ClientState): boolean {
    return state.cartes.initialized;
}

export function isClockOffsetToBeWarned(state: ClientState): boolean {
    return isCartesInitialized(state) && Math.abs(state.cartes.clockOffset) > CLOCK_OFFSET_THRESHOLD
        && !state.cartes.clockOffsetWarned;
}
