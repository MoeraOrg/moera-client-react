import { now } from "util/misc";

export function getCartesListTtl(cartes) {
    if (!cartes) {
        return -now();
    }
    const latest = cartes.reduce((latest, carte) => latest > carte.deadline ? latest : carte.deadline, 0);
    return latest - now();
}

export function getCartesTtl(state) {
    return getCartesListTtl(state.cartes.cartes);
}

export function isCartesToBeUpdated(state) {
    return getCartesTtl(state) < 30 * 60;
}

export function getCurrentCarte(state) {
    const current = now();
    const carte = state.cartes.cartes.find(carte => carte.beginning <= current && carte.deadline >= current);
    return carte ? carte.carte : null;
}

export function isCartesRunOut(state) {
    return getCurrentCarte(state) == null;
}

export function isCartesInitialized(state) {
    return state.cartes.initialized;
}

export function isCartesIpChanged(state) {
    return state.cartes.clientIp != null && state.cartes.cartesIp != null
        && state.cartes.clientIp !== state.cartes.cartesIp;
}
