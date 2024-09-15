import { call, put } from 'typed-redux-saga';
import i18n from 'i18next';

import { Node } from "api";
import { homeIntroduced } from "state/init-selectors";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import {
    ReminderAvatarUpdateAction, ReminderEmailUpdateAction,
    ReminderFullNameUpdateAction,
    StoryDeleteAction,
    storyDeleted,
    StoryPinningUpdateAction,
    StoryReadingUpdateAction,
    StorySatisfyAction,
    StoryTypeBlockAction,
    storyUpdated,
    StoryViewingUpdateAction
} from "state/stories/actions";
import { executor } from "state/executor";
import { profileSet } from "state/profile/actions";
import { flashBox } from "state/flashbox/actions";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";

export default [
    executor("STORY_PINNING_UPDATE", null, storyPinningUpdateSaga),
    executor("STORY_VIEWING_UPDATE", null, storyViewingUpdateSaga, homeIntroduced),
    executor("STORY_READING_UPDATE", null, storyReadingUpdateSaga, homeIntroduced),
    executor("STORY_SATISFY", null, storySatisfySaga),
    executor("STORY_DELETE", null, storyDeleteSaga),
    executor("STORY_TYPE_BLOCK", null, storyTypeBlockSaga),
    executor("REMINDER_FULL_NAME_UPDATE", null, reminderFullNameUpdateSaga),
    executor("REMINDER_AVATAR_UPDATE", null, reminderAvatarUpdateSaga),
    executor("REMINDER_EMAIL_UPDATE", null, reminderEmailUpdateSaga),
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

function* storyViewingUpdateSaga(action: WithContext<StoryViewingUpdateAction>) {
    const {nodeName, id, viewed} = action.payload;
    try {
        const story = yield* call(Node.updateStory, action, nodeName, id, {viewed});
        yield* put(storyUpdated(nodeName, story).causedBy(action));
    } catch (e) {
        // ignore, not important
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

function* storyDeleteSaga(action: WithContext<StoryDeleteAction>) {
    const {nodeName, story} = action.payload;
    try {
        yield* call(Node.deleteStory, action, nodeName, story.id);
        yield* put(storyDeleted(nodeName, story).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* storyTypeBlockSaga(action: WithContext<StoryTypeBlockAction>) {
    const {nodeName, storyType} = action.payload;
    try {
        yield* call(Node.blockInstant, action, nodeName, {storyType});
        yield* put(
            flashBox(i18n.t("story-type-turned-off", {type: i18n.t("story-type-plural." + storyType)})).causedBy(action)
        );
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* reminderFullNameUpdateSaga(action: WithContext<ReminderFullNameUpdateAction>) {
    const {fullName} = action.payload;
    try {
        const profile = yield* call(Node.updateProfile, action, REL_HOME, {fullName});
        yield* put(flashBox(i18n.t("full-name-set")).causedBy(action));
        yield* put(profileSet(profile).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* reminderAvatarUpdateSaga(action: WithContext<ReminderAvatarUpdateAction>) {
    const {avatarId} = action.payload;
    try {
        const profile = yield* call(Node.updateProfile, action, REL_HOME, {avatarId});
        yield* put(flashBox(i18n.t("avatar-set")).causedBy(action));
        yield* put(profileSet(profile).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* reminderEmailUpdateSaga(action: WithContext<ReminderEmailUpdateAction>) {
    const {email} = action.payload;
    try {
        const profile = yield* call(Node.updateProfile, action, REL_HOME, {email});
        yield* put(flashBox(i18n.t("email-set")).causedBy(action));
        yield* put(profileSet(profile).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
