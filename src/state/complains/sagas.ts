import { call, put, select } from 'typed-redux-saga';

import { executor } from "state/executor";
import { introduced } from "state/init-selectors";
import { Node, SheriffComplainStatus } from "api";
import { ClientState } from "state/state";
import { errorThrown } from "state/error/actions";
import {
    COMPLAINS_COMPLAINS_LOAD,
    COMPLAINS_DECISION_POST,
    COMPLAINS_FUTURE_SLICE_LOAD,
    COMPLAINS_GROUP_LOAD,
    COMPLAINS_PAST_SLICE_LOAD,
    complainsComplainsLoaded,
    complainsComplainsLoadFailed,
    ComplainsDecisionPostAction,
    complainsDecisionPosted,
    complainsDecisionPostFailed,
    complainsFutureSliceLoadFailed,
    complainsFutureSliceSet,
    complainsGroupLoaded,
    complainsGroupLoadFailed,
    complainsPastSliceLoadFailed,
    complainsPastSliceSet
} from "state/complains/actions";
import { getActiveComplainGroupId } from "state/complains/selectors";

export default [
    executor(COMPLAINS_PAST_SLICE_LOAD, "", complainsPastSliceLoadSaga, introduced),
    executor(COMPLAINS_FUTURE_SLICE_LOAD, "", complainsFutureSliceLoadSaga, introduced),
    executor(COMPLAINS_GROUP_LOAD, null, complainsGroupLoadSaga, introduced),
    executor(COMPLAINS_COMPLAINS_LOAD, null, complainsComplainsLoadSaga, introduced),
    executor(COMPLAINS_DECISION_POST, payload => payload.groupId, complainsDecisionPostSaga)
];

function* complainsPastSliceLoadSaga() {
    const {after, inboxOnly} = yield* select((state: ClientState) => ({
        after: state.complains.after,
        inboxOnly: state.complains.inboxOnly
    }));
    const status: SheriffComplainStatus | null = inboxOnly ? "prepared" : null;

    try {
        const slice = yield* call(Node.getSheriffComplaintGroupsSlice, "", null, after, 20, status);
        yield* put(complainsPastSliceSet(slice.groups, slice.before, slice.after, slice.total, slice.totalInPast,
            slice.totalInFuture));
    } catch (e) {
        yield* put(complainsPastSliceLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* complainsFutureSliceLoadSaga() {
    const {before, inboxOnly} = yield* select((state: ClientState) => ({
        before: state.complains.before,
        inboxOnly: state.complains.inboxOnly
    }));
    const status: SheriffComplainStatus | null = inboxOnly ? "prepared" : null;

    try {
        const slice = yield* call(Node.getSheriffComplaintGroupsSlice, "", before, null, 20, status);
        yield* put(complainsFutureSliceSet(slice.groups, slice.before, slice.after, slice.total, slice.totalInPast,
            slice.totalInFuture));
    } catch (e) {
        yield* put(complainsFutureSliceLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* complainsGroupLoadSaga() {
    const id = yield* select(getActiveComplainGroupId);
    if (id == null) {
        return;
    }
    try {
        const group = yield* call(Node.getSheriffComplaintGroup, "", id);
        yield* put(complainsGroupLoaded(group));
    } catch (e) {
        yield* put(complainsGroupLoadFailed(id));
        yield* put(errorThrown(e));
    }
}

function* complainsComplainsLoadSaga() {
    const id = yield* select(getActiveComplainGroupId);
    if (id == null) {
        return;
    }
    try {
        const complains = yield* call(Node.getSheriffComplaintsByGroup, "", id);
        yield* put(complainsComplainsLoaded(id, complains));
    } catch (e) {
        yield* put(complainsComplainsLoadFailed(id));
        yield* put(errorThrown(e));
    }
}

function* complainsDecisionPostSaga(action: ComplainsDecisionPostAction) {
    const {groupId, decision} = action.payload;

    try {
        const group = yield* call(Node.updateSheriffComplaintGroup, "", groupId, decision);
        yield* put(complainsDecisionPosted(group));
    } catch (e) {
        yield* put(complainsDecisionPostFailed(groupId));
        yield* put(errorThrown(e));
    }
}
