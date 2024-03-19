import { call, put } from 'typed-redux-saga';

import { Node } from "api";
import { homeIntroduced } from "state/init-selectors";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import {
    StoryPinningUpdateAction,
    StoryReadingUpdateAction,
    StorySatisfyAction,
    storyUpdated
} from "state/stories/actions";
import { executor } from "state/executor";
import { REL_CURRENT } from "util/rel-node-name";

export default [
    executor("STORY_PINNING_UPDATE", null, storyPinningUpdateSaga),
    executor("STORY_READING_UPDATE", null, storyReadingUpdateSaga, homeIntroduced),
    executor("STORY_SATISFY", null, storySatisfySaga)
];

function* storyPinningUpdateSaga(action: WithContext<StoryPinningUpdateAction>) {
    const {id, pinned} = action.payload;
    try {
        const story = yield* call(Node.updateStory, action, REL_CURRENT, id, {pinned});
        yield* put(storyUpdated(REL_CURRENT, story).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* storyReadingUpdateSaga(action: WithContext<StoryReadingUpdateAction>) {
    const {nodeName, id, read} = action.payload;
    try {
        const story = yield* call(Node.updateStory, action, nodeName, id, {read});
        yield* put(storyUpdated(nodeName, story).causedBy(action));
    } catch (e) {
        // ignore, not important
    }
}

function* storySatisfySaga(action: WithContext<StorySatisfyAction>) {
    const {nodeName, id} = action.payload;
    try {
        const story = yield* call(Node.updateStory, action, nodeName, id, {satisfied: true});
        yield* put(storyUpdated(nodeName, story).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
