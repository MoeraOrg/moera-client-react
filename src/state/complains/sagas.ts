import { call, put, select } from 'typed-redux-saga';

import { executor } from "state/executor";
import { introduced } from "state/init-selectors";
import { Node } from "api";
import { ClientState } from "state/state";
import { errorThrown } from "state/error/actions";
import {
    COMPLAINS_FUTURE_SLICE_LOAD,
    COMPLAINS_PAST_SLICE_LOAD,
    complainsFutureSliceLoadFailed,
    complainsFutureSliceSet,
    complainsPastSliceLoadFailed,
    complainsPastSliceSet
} from "state/complains/actions";

export default [
    executor(COMPLAINS_PAST_SLICE_LOAD, "", complainsPastSliceLoadSaga, introduced),
    executor(COMPLAINS_FUTURE_SLICE_LOAD, "", complainsFutureSliceLoadSaga, introduced)
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
