import { call, put } from 'redux-saga/effects';

import { Node } from "api/node";
import { errorThrown } from "state/error/actions";
import { storyUpdated } from "state/stories/actions";

export function* storyPinningUpdateSaga(action) {
    const {id, pinned} = action.payload;
    try {
        const data = yield call(Node.putStory, id, {pinned});
        yield put(storyUpdated(data));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* storyReadingUpdateSaga(action) {
    const {id, read} = action.payload;
    try {
        const data = yield call(Node.putStory, id, {read});
        yield put(storyUpdated(data));
    } catch (e) {
        yield put(errorThrown(e));
    }
}
