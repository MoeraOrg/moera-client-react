export const CARTES_LOAD = "CARTES_LOAD";
export const cartesLoad = () => ({
    type: CARTES_LOAD
});

export const CARTES_SET = "CARTES_SET";
export const cartesSet = (cartesIp, cartes, clockOffset) => ({
    type: CARTES_SET,
    payload: {cartesIp, cartes, clockOffset}
});

export const CARTES_PURGE_EXPIRED = "CARTES_PURGE_EXPIRED";
export const cartesPurgeExpired = () => ({
    type: CARTES_PURGE_EXPIRED
});

export const CLOCK_OFFSET_WARN = "CLOCK_OFFSET_WARN";
export const clockOffsetWarn = () => ({
    type: CLOCK_OFFSET_WARN
});
