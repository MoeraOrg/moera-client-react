import { conj, trigger } from "state/trigger";
import { newLocation } from "state/navigation/actions";
import { isAtComplaintsPage } from "state/navigation/selectors";
import {
    complaintsComplaintsLoad,
    complaintsFutureSliceLoad,
    complaintsGroupLoad,
    complaintsPastSliceLoad
} from "state/complaints/actions";
import {
    isActiveComplaintGroupToBeLoaded,
    isFutureComplaintGroupsToBeLoaded,
    isPastComplaintGroupsToBeLoaded
} from "state/complaints/selectors";

export default [
    trigger("GO_TO_PAGE", conj(isAtComplaintsPage, isFutureComplaintGroupsToBeLoaded), complaintsFutureSliceLoad),
    trigger("GO_TO_PAGE", conj(isAtComplaintsPage, isPastComplaintGroupsToBeLoaded), complaintsPastSliceLoad),
    trigger("COMPLAINTS_INBOX_SET", isPastComplaintGroupsToBeLoaded, complaintsPastSliceLoad),
    trigger(["COMPLAINTS_GROUP_OPEN", "COMPLAINTS_GROUP_CLOSE", "COMPLAINTS_DECISION_POSTED"], true, newLocation),
    trigger("COMPLAINTS_GROUP_OPEN", isActiveComplaintGroupToBeLoaded, complaintsGroupLoad),
    trigger(["COMPLAINTS_GROUP_OPEN", "HOME_READY"], true, complaintsComplaintsLoad)
];
