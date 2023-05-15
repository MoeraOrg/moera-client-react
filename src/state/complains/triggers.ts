import { conj, trigger } from "state/trigger";
import { GO_TO_PAGE } from "state/navigation/actions";
import { isAtComplainsPage } from "state/navigation/selectors";
import { complainsFutureSliceLoad, complainsPastSliceLoad } from "state/complains/actions";
import { isFutureComplainGroupsToBeLoaded, isPastComplainGroupsToBeLoaded } from "state/complains/selectors";

export default [
    trigger(GO_TO_PAGE, conj(isAtComplainsPage, isFutureComplainGroupsToBeLoaded), complainsFutureSliceLoad),
    trigger(GO_TO_PAGE, conj(isAtComplainsPage, isPastComplainGroupsToBeLoaded), complainsPastSliceLoad)
];
