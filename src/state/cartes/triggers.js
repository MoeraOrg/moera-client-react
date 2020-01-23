import { conj, trigger } from "state/trigger";
import { PULSE_1MIN } from "state/pulse/actions";
import { cartesLoad, cartesPurgeExpired } from "state/cartes/actions";
import { isConnectedToHome } from "state/home/selectors";
import { isCartesToBeUpdated } from "state/cartes/selectors";

export default [
    trigger(PULSE_1MIN, true, cartesPurgeExpired),
    trigger(PULSE_1MIN, conj(isConnectedToHome, isCartesToBeUpdated), cartesLoad),
];
