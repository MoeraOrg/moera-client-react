import { conj, trigger } from "state/trigger";
import { GO_TO_PAGE } from "state/navigation/actions";
import { isAtPeoplePage } from "state/navigation/selectors";
import { isPeopleGeneralToBeLoaded } from "state/people/selectors";
import { peopleGeneralLoad } from "state/people/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtPeoplePage, isPeopleGeneralToBeLoaded), peopleGeneralLoad)
];
