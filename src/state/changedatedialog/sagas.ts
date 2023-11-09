import { call, put } from 'typed-redux-saga';

import { Node } from "api";
import { storyUpdated } from "state/stories/actions";
import { errorThrown } from "state/error/actions";
import { closeChangeDateDialog, StoryChangeDateAction, storyChangeDateFailed } from "state/changedatedialog/actions";
import { executor } from "state/executor";

export default [
    executor("STORY_CHANGE_DATE", null, storyChangeDateSaga)
];

function* storyChangeDateSaga(action: StoryChangeDateAction) {
    const {id, publishedAt} = action.payload;
    try {
        const story = yield* call(Node.updateStory, action, "", id, {publishAt: publishedAt});
        yield* put(closeChangeDateDialog().causedBy(action));
        yield* put(storyUpdated(story).causedBy(action));
    } catch (e) {
        yield* put(storyChangeDateFailed().causedBy(action))
        yield* put(errorThrown(e));
    }
}
