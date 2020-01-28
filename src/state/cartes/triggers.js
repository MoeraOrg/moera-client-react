import { conj, trigger } from "state/trigger";
import { PULSE_1MIN } from "state/pulse/actions";
import { cartesLoad, cartesPurgeExpired } from "state/cartes/actions";
import { isConnectedToHome } from "state/home/selectors";
import { isCartesIpChanged, isCartesToBeUpdated } from "state/cartes/selectors";
import { CONNECTED_TO_HOME } from "state/home/actions";
import { EVENT_HOME_SUBSCRIBED } from "api/events/actions";

export default [
    trigger([CONNECTED_TO_HOME, EVENT_HOME_SUBSCRIBED], isCartesIpChanged, cartesLoad),
    trigger(PULSE_1MIN, true, cartesPurgeExpired),
    trigger(PULSE_1MIN, conj(isConnectedToHome, isCartesToBeUpdated), cartesLoad),
];
