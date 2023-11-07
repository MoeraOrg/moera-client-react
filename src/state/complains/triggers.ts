import { conj, trigger } from "state/trigger";
import { GO_TO_PAGE, newLocation } from "state/navigation/actions";
import { isAtComplainsPage } from "state/navigation/selectors";
import {
    complainsComplainsLoad,
    complainsFutureSliceLoad,
    complainsGroupLoad,
    complainsPastSliceLoad
} from "state/complains/actions";
import {
    isActiveComplainGroupToBeLoaded,
    isFutureComplainGroupsToBeLoaded,
    isPastComplainGroupsToBeLoaded
} from "state/complains/selectors";

export default [
    trigger("GO_TO_PAGE", conj(isAtComplainsPage, isFutureComplainGroupsToBeLoaded), complainsFutureSliceLoad),
    trigger("GO_TO_PAGE", conj(isAtComplainsPage, isPastComplainGroupsToBeLoaded), complainsPastSliceLoad),
    trigger("COMPLAINS_INBOX_SET", isPastComplainGroupsToBeLoaded, complainsPastSliceLoad),
    trigger(["COMPLAINS_GROUP_OPEN", "COMPLAINS_GROUP_CLOSE", "COMPLAINS_DECISION_POSTED"], true, newLocation),
    trigger("COMPLAINS_GROUP_OPEN", isActiveComplainGroupToBeLoaded, complainsGroupLoad),
    trigger(["COMPLAINS_GROUP_OPEN", "HOME_INTRODUCED"], true, complainsComplainsLoad)
];
