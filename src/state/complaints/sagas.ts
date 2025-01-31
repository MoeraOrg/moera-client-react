import { executor } from "state/executor";
import { homeIntroduced } from "state/init-barriers";
import { Node, SheriffComplaintStatus } from "api";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import {
    ComplaintsComplaintsLoadAction,
    complaintsComplaintsLoaded,
    complaintsComplaintsLoadFailed,
    ComplaintsDecisionPostAction,
    complaintsDecisionPosted,
    complaintsDecisionPostFailed,
    ComplaintsFutureSliceLoadAction,
    complaintsFutureSliceLoadFailed,
    complaintsFutureSliceSet,
    ComplaintsGroupLoadAction,
    complaintsGroupLoaded,
    complaintsGroupLoadFailed,
    ComplaintsPastSliceLoadAction,
    complaintsPastSliceLoadFailed,
    complaintsPastSliceSet
} from "state/complaints/actions";
import { getActiveComplaintGroupId } from "state/complaints/selectors";
import { REL_CURRENT } from "util/rel-node-name";
import { dispatch, select } from "state/store-sagas";

export default [
    executor("COMPLAINTS_PAST_SLICE_LOAD", "", complaintsPastSliceLoadSaga),
    executor("COMPLAINTS_FUTURE_SLICE_LOAD", "", complaintsFutureSliceLoadSaga),
    executor("COMPLAINTS_GROUP_LOAD", null, complaintsGroupLoadSaga),
    executor("COMPLAINTS_COMPLAINTS_LOAD", null, complaintsComplaintsLoadSaga),
    executor("COMPLAINTS_DECISION_POST", payload => payload.groupId, complaintsDecisionPostSaga)
];

async function complaintsPastSliceLoadSaga(action: WithContext<ComplaintsPastSliceLoadAction>): Promise<void> {
    await homeIntroduced();
    const {after, inboxOnly} = select(state => ({
        after: state.complaints.after,
        inboxOnly: state.complaints.inboxOnly
    }));
    const status: SheriffComplaintStatus | null = inboxOnly ? "prepared" : null;

    try {
        const slice = await Node.getSheriffComplaintGroupsSlice(action, REL_CURRENT, null, after, 20, status);
        dispatch(complaintsPastSliceSet(slice.groups, slice.before, slice.after, slice.total, slice.totalInPast,
            slice.totalInFuture).causedBy(action));
    } catch (e) {
        dispatch(complaintsPastSliceLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function complaintsFutureSliceLoadSaga(action: WithContext<ComplaintsFutureSliceLoadAction>): Promise<void> {
    await homeIntroduced();
    const {before, inboxOnly} = select(state => ({
        before: state.complaints.before,
        inboxOnly: state.complaints.inboxOnly
    }));
    const status: SheriffComplaintStatus | null = inboxOnly ? "prepared" : null;

    try {
        const slice = await Node.getSheriffComplaintGroupsSlice(action, REL_CURRENT, before, null, 20, status);
        dispatch(complaintsFutureSliceSet(
            slice.groups, slice.before, slice.after, slice.total, slice.totalInPast, slice.totalInFuture
        ).causedBy(action));
    } catch (e) {
        dispatch(complaintsFutureSliceLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function complaintsGroupLoadSaga(action: WithContext<ComplaintsGroupLoadAction>): Promise<void> {
    await homeIntroduced();
    const id = select(getActiveComplaintGroupId);
    if (id == null) {
        return;
    }
    try {
        const group = await Node.getSheriffComplaintGroup(action, REL_CURRENT, id);
        dispatch(complaintsGroupLoaded(group).causedBy(action));
    } catch (e) {
        dispatch(complaintsGroupLoadFailed(id).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function complaintsComplaintsLoadSaga(action: WithContext<ComplaintsComplaintsLoadAction>): Promise<void> {
    await homeIntroduced();
    const id = select(getActiveComplaintGroupId);
    if (id == null) {
        return;
    }
    try {
        const complaints = await Node.getSheriffComplaintsByGroup(action, REL_CURRENT, id);
        dispatch(complaintsComplaintsLoaded(id, complaints).causedBy(action));
    } catch (e) {
        dispatch(complaintsComplaintsLoadFailed(id).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function complaintsDecisionPostSaga(action: WithContext<ComplaintsDecisionPostAction>): Promise<void> {
    const {groupId, decision} = action.payload;

    try {
        const group = await Node.updateSheriffComplaintGroup(action, REL_CURRENT, groupId, decision);
        dispatch(complaintsDecisionPosted(group).causedBy(action));
    } catch (e) {
        dispatch(complaintsDecisionPostFailed(groupId).causedBy(action));
        dispatch(errorThrown(e));
    }
}
