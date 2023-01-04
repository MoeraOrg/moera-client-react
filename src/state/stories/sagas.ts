import { call, put } from 'typed-redux-saga';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import {
    STORY_PINNING_UPDATE,
    STORY_READING_UPDATE,
    STORY_SATISFY,
    STORY_VIEWING_UPDATE,
    StoryPinningUpdateAction,
    StoryReadingUpdateAction,
    StorySatisfyAction,
    storyUpdated,
    StoryViewingUpdateAction
} from "state/stories/actions";
import { executor } from "state/executor";

export default [
    executor(STORY_PINNING_UPDATE, null, storyPinningUpdateSaga),
    executor(STORY_READING_UPDATE, null, storyReadingUpdateSaga),
    executor(STORY_VIEWING_UPDATE, null, storyViewingUpdateSaga),
    executor(STORY_SATISFY, null, storySatisfySaga)
];

function* storyPinningUpdateSaga(action: StoryPinningUpdateAction) {
    const {id, pinned} = action.payload;
    try {
        const story = yield* call(Node.putStory, "", id, {pinned});
        yield* put(storyUpdated(story));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* storyReadingUpdateSaga(action: StoryReadingUpdateAction) {
    const {id, read} = action.payload;
    try {
        const story = yield* call(Node.putStory, ":", id, {read});
        yield* put(storyUpdated(story));
    } catch (e) {
        // ignore, not important
    }
}

function* storyViewingUpdateSaga(action: StoryViewingUpdateAction) {
    const {id, viewed} = action.payload;
    try {
        const story = yield* call(Node.putStory, ":", id, {viewed});
        yield* put(storyUpdated(story));
    } catch (e) {
        // ignore, not important
    }
}

function* storySatisfySaga(action: StorySatisfyAction) {
    const {id} = action.payload;
    try {
        const story = yield* call(Node.putStory, ":", id, {satisfied: true});
        yield* put(storyUpdated(story));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
