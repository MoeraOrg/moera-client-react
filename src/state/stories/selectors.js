import { isAtHomeNode } from "state/node/selectors";

export function isCurrentNodeStory(state, story) {
    if (story.feedName == null) {
        return true;
    }
    return !story.feedName.startsWith(":") || isAtHomeNode(state);
}
