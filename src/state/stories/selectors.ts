import { isAtHomeNode } from "state/node/selectors";
import { ClientState } from "state/state";
import { StoryInfo } from "api";

export function isCurrentNodeStory(state: ClientState, story: StoryInfo): boolean {
    if (story.feedName == null) {
        return true;
    }
    return !story.feedName.startsWith(":") || isAtHomeNode(state);
}
