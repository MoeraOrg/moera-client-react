import { conj, trigger } from "state/trigger";
import { PULSE_1MIN } from "state/pulse/actions";
import { HOME_INTRODUCED } from "state/home/actions";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { cartesLoad, cartesPurgeExpired } from "state/cartes/actions";
import { isCartesToBeUpdated } from "state/cartes/selectors";
import { WAKE_UP } from "state/navigation/actions";

export default [
    trigger(PULSE_1MIN, true, cartesPurgeExpired),
    trigger(
        [HOME_INTRODUCED, PULSE_1MIN, WAKE_UP],
        conj(isConnectedToHome, isHomeOwnerNameSet, isCartesToBeUpdated),
        cartesLoad
    ),
    // TODO Temporarily disabled
    // trigger([CONNECTED_TO_HOME, CARTES_SET], isClockOffsetToBeWarned, clockOffsetWarn)
];
