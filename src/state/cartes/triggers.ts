import { conj, trigger } from "state/trigger";
import { PULSE_1MIN } from "state/pulse/actions";
import { CARTES_SET, cartesLoad, cartesPurgeExpired } from "state/cartes/actions";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { isCartesToBeUpdated } from "state/cartes/selectors";
import { WAKE_UP } from "state/navigation/actions";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, HOME_OWNER_SET } from "state/home/actions";

export default [
    trigger(PULSE_1MIN, true, cartesPurgeExpired),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, CARTES_SET, HOME_OWNER_SET, PULSE_1MIN, WAKE_UP],
        conj(isConnectedToHome, isHomeOwnerNameSet, isCartesToBeUpdated),
        cartesLoad
    ),
    // TODO Temporarily disabled
    // trigger([CONNECTED_TO_HOME, CARTES_SET], isClockOffsetToBeWarned, clockOffsetWarn)
];
