import { call, put } from 'typed-redux-saga/macro';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import {
    STORY_PINNING_UPDATE,
    STORY_READING_UPDATE,
    StoryPinningUpdateAction,
    StoryReadingUpdateAction,
    storyUpdated
} from "state/stories/actions";
import { executor } from "state/executor";

export default [
    executor(STORY_PINNING_UPDATE, null, storyPinningUpdateSaga),
    executor(STORY_READING_UPDATE, null, storyReadingUpdateSaga)
];

function* storyPinningUpdateSaga(action: StoryPinningUpdateAction) {
    const {id, pinned} = action.payload;
    try {
        const data = yield* call(Node.putStory, "", id, {pinned});
        yield* put(storyUpdated(data));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* storyReadingUpdateSaga(action: StoryReadingUpdateAction) {
    const {id, read} = action.payload;
    try {
        const data = yield* call(Node.putStory, ":", id, {read});
        yield* put(storyUpdated(data));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
