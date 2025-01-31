import { Node } from "api";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
import { storyUpdated } from "state/stories/actions";
import { errorThrown } from "state/error/actions";
import { closeChangeDateDialog, StoryChangeDateAction, storyChangeDateFailed } from "state/changedatedialog/actions";
import { executor } from "state/executor";
import { REL_CURRENT } from "util/rel-node-name";

export default [
    executor("STORY_CHANGE_DATE", null, storyChangeDateSaga)
];

async function storyChangeDateSaga(action: WithContext<StoryChangeDateAction>): Promise<void> {
    const {id, publishedAt} = action.payload;
    try {
        const story = await Node.updateStory(action, REL_CURRENT, id, {publishAt: publishedAt});
        dispatch(closeChangeDateDialog().causedBy(action));
        dispatch(storyUpdated(REL_CURRENT, story).causedBy(action));
    } catch (e) {
        dispatch(storyChangeDateFailed().causedBy(action))
        dispatch(errorThrown(e));
    }
}
