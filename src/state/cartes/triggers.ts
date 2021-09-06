import { conj, trigger } from "state/trigger";
import { PULSE_1MIN } from "state/pulse/actions";
import { CARTES_SET, cartesLoad, cartesPurgeExpired, clockOffsetWarn } from "state/cartes/actions";
import { isConnectedToHome } from "state/home/selectors";
import { isCartesToBeUpdated, isClockOffsetToBeWarned } from "state/cartes/selectors";
import { CONNECTED_TO_HOME } from "state/home/actions";
import { WAKE_UP } from "state/navigation/actions";

export default [
    trigger(PULSE_1MIN, true, cartesPurgeExpired),
    trigger([PULSE_1MIN, WAKE_UP], conj(isConnectedToHome, isCartesToBeUpdated), cartesLoad),
    trigger([CONNECTED_TO_HOME, CARTES_SET], isClockOffsetToBeWarned, clockOffsetWarn)
];
