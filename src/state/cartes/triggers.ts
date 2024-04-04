import { conj, trigger } from "state/trigger";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { cartesLoad, cartesPurgeExpired, cartesUpdateServiceWorker } from "state/cartes/actions";
import { isCartesToBeUpdated } from "state/cartes/selectors";

export default [
    trigger("PULSE_1MIN", true, cartesPurgeExpired),
    trigger(
        ["HOME_READY", "PULSE_1MIN", "WAKE_UP"],
        conj(isConnectedToHome, isHomeOwnerNameSet, isCartesToBeUpdated),
        cartesLoad
    ),
    trigger(
        ["CONNECTED_TO_HOME", "DISCONNECTED_FROM_HOME", "CARTES_SET", "CARTES_PURGE_EXPIRED"],
        true,
        cartesUpdateServiceWorker
    ),
    // TODO Temporarily disabled
    // trigger([CONNECTED_TO_HOME, CARTES_SET], isClockOffsetToBeWarned, clockOffsetWarn)
];
