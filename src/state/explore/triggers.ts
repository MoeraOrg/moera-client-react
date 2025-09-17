import { conj, trigger } from "state/trigger";
import { isAtActivePeoplePage } from "state/navigation/selectors";
import { activePeopleLoad } from "state/explore/actions";
import { isActivePeopleLoaded, isActivePeopleToBeLoaded } from "state/explore/selectors";

export default [
    trigger("GO_TO_PAGE", conj(isAtActivePeoplePage, isActivePeopleToBeLoaded), activePeopleLoad),
    trigger("PULSE_6H", isActivePeopleLoaded, activePeopleLoad),
];
