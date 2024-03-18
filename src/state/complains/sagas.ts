import { call, put, select } from 'typed-redux-saga';

import { executor } from "state/executor";
import { homeIntroduced } from "state/init-selectors";
import { Node, SheriffComplainStatus } from "api";
import { ClientState } from "state/state";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import {
    ComplainsComplainsLoadAction,
    complainsComplainsLoaded,
    complainsComplainsLoadFailed,
    ComplainsDecisionPostAction,
    complainsDecisionPosted,
    complainsDecisionPostFailed,
    ComplainsFutureSliceLoadAction,
    complainsFutureSliceLoadFailed,
    complainsFutureSliceSet,
    ComplainsGroupLoadAction,
    complainsGroupLoaded,
    complainsGroupLoadFailed,
    ComplainsPastSliceLoadAction,
    complainsPastSliceLoadFailed,
    complainsPastSliceSet
} from "state/complains/actions";
import { getActiveComplainGroupId } from "state/complains/selectors";
import { REL_CURRENT } from "util/rel-node-name";

export default [
    executor("COMPLAINS_PAST_SLICE_LOAD", "", complainsPastSliceLoadSaga, homeIntroduced),
    executor("COMPLAINS_FUTURE_SLICE_LOAD", "", complainsFutureSliceLoadSaga, homeIntroduced),
    executor("COMPLAINS_GROUP_LOAD", null, complainsGroupLoadSaga, homeIntroduced),
    executor("COMPLAINS_COMPLAINS_LOAD", null, complainsComplainsLoadSaga, homeIntroduced),
    executor("COMPLAINS_DECISION_POST", payload => payload.groupId, complainsDecisionPostSaga)
];

function* complainsPastSliceLoadSaga(action: WithContext<ComplainsPastSliceLoadAction>) {
    const {after, inboxOnly} = yield* select((state: ClientState) => ({
        after: state.complains.after,
        inboxOnly: state.complains.inboxOnly
    }));
    const status: SheriffComplainStatus | null = inboxOnly ? "prepared" : null;

    try {
        const slice = yield* call(Node.getSheriffComplaintGroupsSlice, action, REL_CURRENT, null, after, 20, status);
        yield* put(complainsPastSliceSet(slice.groups, slice.before, slice.after, slice.total, slice.totalInPast,
            slice.totalInFuture).causedBy(action));
    } catch (e) {
        yield* put(complainsPastSliceLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* complainsFutureSliceLoadSaga(action: WithContext<ComplainsFutureSliceLoadAction>) {
    const {before, inboxOnly} = yield* select((state: ClientState) => ({
        before: state.complains.before,
        inboxOnly: state.complains.inboxOnly
    }));
    const status: SheriffComplainStatus | null = inboxOnly ? "prepared" : null;

    try {
        const slice = yield* call(Node.getSheriffComplaintGroupsSlice, action, REL_CURRENT, before, null, 20, status);
        yield* put(complainsFutureSliceSet(
            slice.groups, slice.before, slice.after, slice.total, slice.totalInPast, slice.totalInFuture
        ).causedBy(action));
    } catch (e) {
        yield* put(complainsFutureSliceLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* complainsGroupLoadSaga(action: WithContext<ComplainsGroupLoadAction>) {
    const id = yield* select(getActiveComplainGroupId);
    if (id == null) {
        return;
    }
    try {
        const group = yield* call(Node.getSheriffComplaintGroup, action, REL_CURRENT, id);
        yield* put(complainsGroupLoaded(group).causedBy(action));
    } catch (e) {
        yield* put(complainsGroupLoadFailed(id).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* complainsComplainsLoadSaga(action: WithContext<ComplainsComplainsLoadAction>) {
    const id = yield* select(getActiveComplainGroupId);
    if (id == null) {
        return;
    }
    try {
        const complains = yield* call(Node.getSheriffComplaintsByGroup, action, REL_CURRENT, id);
        yield* put(complainsComplainsLoaded(id, complains).causedBy(action));
    } catch (e) {
        yield* put(complainsComplainsLoadFailed(id).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* complainsDecisionPostSaga(action: WithContext<ComplainsDecisionPostAction>) {
    const {groupId, decision} = action.payload;

    try {
        const group = yield* call(Node.updateSheriffComplaintGroup, action, REL_CURRENT, groupId, decision);
        yield* put(complainsDecisionPosted(group).causedBy(action));
    } catch (e) {
        yield* put(complainsDecisionPostFailed(groupId).causedBy(action));
        yield* put(errorThrown(e));
    }
}
