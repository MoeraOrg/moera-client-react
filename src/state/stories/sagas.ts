import { call, put } from 'typed-redux-saga';

import { Node } from "api";
import { homeIntroduced } from "state/init-selectors";
import { errorThrown } from "state/error/actions";
import {
    StoryPinningUpdateAction,
    StoryReadingUpdateAction,
    StorySatisfyAction,
    storyUpdated
} from "state/stories/actions";
import { executor } from "state/executor";

export default [
    executor("STORY_PINNING_UPDATE", null, storyPinningUpdateSaga),
    executor("STORY_READING_UPDATE", null, storyReadingUpdateSaga, homeIntroduced),
    executor("STORY_SATISFY", null, storySatisfySaga)
];

function* storyPinningUpdateSaga(action: StoryPinningUpdateAction) {
    const {id, pinned} = action.payload;
    try {
        const story = yield* call(Node.updateStory, action, "", id, {pinned});
        yield* put(storyUpdated(story).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* storyReadingUpdateSaga(action: StoryReadingUpdateAction) {
    const {id, read} = action.payload;
    try {
        const story = yield* call(Node.updateStory, action, ":", id, {read});
        yield* put(storyUpdated(story).causedBy(action));
    } catch (e) {
        // ignore, not important
    }
}

function* storySatisfySaga(action: StorySatisfyAction) {
    const {id} = action.payload;
    try {
        const story = yield* call(Node.updateStory, action, ":", id, {satisfied: true});
        yield* put(storyUpdated(story).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
