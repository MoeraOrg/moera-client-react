import { call, put, select } from 'typed-redux-saga';

import { executor } from "state/executor";
import { introduced } from "state/init-selectors";
import { Node } from "api";
import { ClientState } from "state/state";
import { errorThrown } from "state/error/actions";
import {
    COMPLAINS_COMPLAINS_LOAD,
    COMPLAINS_FUTURE_SLICE_LOAD,
    COMPLAINS_GROUP_LOAD,
    COMPLAINS_PAST_SLICE_LOAD,
    complainsComplainsLoaded,
    complainsComplainsLoadFailed,
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
    executor(COMPLAINS_COMPLAINS_LOAD, null, complainsComplainsLoadSaga, introduced)
];

function* complainsPastSliceLoadSaga() {
    const after = yield* select((state: ClientState) => state.complains.after);
    try {
        const data = yield* call(Node.getSheriffComplainGroupsSlice, ":", null, after, 20);
        yield* put(complainsPastSliceSet(data.groups, data.before, data.after, data.total, data.totalInPast,
            data.totalInFuture));
    } catch (e) {
        yield* put(complainsPastSliceLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* complainsFutureSliceLoadSaga() {
    const before = yield* select((state: ClientState) => state.complains.before);
    try {
        const data = yield* call(Node.getSheriffComplainGroupsSlice, ":", before, null, 20);
        yield* put(complainsFutureSliceSet(data.groups, data.before, data.after, data.total, data.totalInPast,
            data.totalInFuture));
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
        const group = yield* call(Node.getSheriffComplainGroup, ":", id);
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
        const complains = yield* call(Node.getSheriffComplainsByGroup, ":", id);
        yield* put(complainsComplainsLoaded(id, complains));
    } catch (e) {
        yield* put(complainsComplainsLoadFailed(id));
        yield* put(errorThrown(e));
    }
}
