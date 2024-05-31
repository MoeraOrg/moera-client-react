import { call, put, select } from 'typed-redux-saga';

import { executor } from "state/executor";
import { homeIntroduced } from "state/init-selectors";
import { Node, SheriffComplaintStatus } from "api";
import { ClientState } from "state/state";
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

export default [
    executor("COMPLAINTS_PAST_SLICE_LOAD", "", complaintsPastSliceLoadSaga, homeIntroduced),
    executor("COMPLAINTS_FUTURE_SLICE_LOAD", "", complaintsFutureSliceLoadSaga, homeIntroduced),
    executor("COMPLAINTS_GROUP_LOAD", null, complaintsGroupLoadSaga, homeIntroduced),
    executor("COMPLAINTS_COMPLAINTS_LOAD", null, complaintsComplaintsLoadSaga, homeIntroduced),
    executor("COMPLAINTS_DECISION_POST", payload => payload.groupId, complaintsDecisionPostSaga)
];

function* complaintsPastSliceLoadSaga(action: WithContext<ComplaintsPastSliceLoadAction>) {
    const {after, inboxOnly} = yield* select((state: ClientState) => ({
        after: state.complaints.after,
        inboxOnly: state.complaints.inboxOnly
    }));
    const status: SheriffComplaintStatus | null = inboxOnly ? "prepared" : null;

    try {
        const slice = yield* call(Node.getSheriffComplaintGroupsSlice, action, REL_CURRENT, null, after, 20, status);
        yield* put(complaintsPastSliceSet(slice.groups, slice.before, slice.after, slice.total, slice.totalInPast,
            slice.totalInFuture).causedBy(action));
    } catch (e) {
        yield* put(complaintsPastSliceLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* complaintsFutureSliceLoadSaga(action: WithContext<ComplaintsFutureSliceLoadAction>) {
    const {before, inboxOnly} = yield* select((state: ClientState) => ({
        before: state.complaints.before,
        inboxOnly: state.complaints.inboxOnly
    }));
    const status: SheriffComplaintStatus | null = inboxOnly ? "prepared" : null;

    try {
        const slice = yield* call(Node.getSheriffComplaintGroupsSlice, action, REL_CURRENT, before, null, 20, status);
        yield* put(complaintsFutureSliceSet(
            slice.groups, slice.before, slice.after, slice.total, slice.totalInPast, slice.totalInFuture
        ).causedBy(action));
    } catch (e) {
        yield* put(complaintsFutureSliceLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* complaintsGroupLoadSaga(action: WithContext<ComplaintsGroupLoadAction>) {
    const id = yield* select(getActiveComplaintGroupId);
    if (id == null) {
        return;
    }
    try {
        const group = yield* call(Node.getSheriffComplaintGroup, action, REL_CURRENT, id);
        yield* put(complaintsGroupLoaded(group).causedBy(action));
    } catch (e) {
        yield* put(complaintsGroupLoadFailed(id).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* complaintsComplaintsLoadSaga(action: WithContext<ComplaintsComplaintsLoadAction>) {
    const id = yield* select(getActiveComplaintGroupId);
    if (id == null) {
        return;
    }
    try {
        const complaints = yield* call(Node.getSheriffComplaintsByGroup, action, REL_CURRENT, id);
        yield* put(complaintsComplaintsLoaded(id, complaints).causedBy(action));
    } catch (e) {
        yield* put(complaintsComplaintsLoadFailed(id).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* complaintsDecisionPostSaga(action: WithContext<ComplaintsDecisionPostAction>) {
    const {groupId, decision} = action.payload;

    try {
        const group = yield* call(Node.updateSheriffComplaintGroup, action, REL_CURRENT, groupId, decision);
        yield* put(complaintsDecisionPosted(group).causedBy(action));
    } catch (e) {
        yield* put(complaintsDecisionPostFailed(groupId).causedBy(action));
        yield* put(errorThrown(e));
    }
}
