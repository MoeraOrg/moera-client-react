import i18n from 'i18next';

import { StoryInfo } from "api";
import { InstantStoryButtonsActionSupplier } from "ui/instant/instant-types";
import { messageBox } from "state/messagebox/actions";
import { storyReadingUpdate, storyViewingUpdate } from "state/stories/actions";
import { REL_HOME } from "util/rel-node-name";

export const instantStoryDefrostingAction: InstantStoryButtonsActionSupplier =
    (story: StoryInfo) => !story.viewed
        ? [
            messageBox(
                i18n.t("defrosting-message-box"),
                storyReadingUpdate(REL_HOME, story.feedName, story.id, true)
            ),
            storyViewingUpdate(REL_HOME, story.feedName, story.id, true)
        ]
        : null;
