import { conj, disj, trigger } from "state/trigger";
import { isAtActivePeoplePage, isAtStartReadingPage } from "state/navigation/selectors";
import { activePeopleLoad } from "state/explore/actions";
import { isActivePeopleLoaded, isActivePeopleToBeLoaded } from "state/explore/selectors";

export default [
    trigger(
        "GO_TO_PAGE",
        conj(disj(isAtActivePeoplePage, isAtStartReadingPage), isActivePeopleToBeLoaded),
        activePeopleLoad
    ),
    trigger("PULSE_6H", isActivePeopleLoaded, activePeopleLoad),
];
