import { call, put } from 'redux-saga/effects';

import { Node } from "api/node";
import { storyUpdated } from "state/stories/actions";
import { errorThrown } from "state/error/actions";
import { closeChangeDateDialog, storyChangeDateFailed } from "state/changedatedialog/actions";

export function* storyChangeDateSaga(action) {
    const {id, publishedAt} = action.payload;
    try {
        const data = yield call(Node.putStory, "", id, {publishAt: publishedAt});
        yield put(closeChangeDateDialog());
        yield put(storyUpdated(data));
    } catch (e) {
        yield put(storyChangeDateFailed())
        yield put(errorThrown(e));
    }
}
