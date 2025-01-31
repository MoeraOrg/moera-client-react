import i18n from 'i18next';

import { Node, SettingInfo } from "api";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { dispatch, select } from "state/store-sagas";
import { homeIntroduced } from "state/init-barriers";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import {
    ReminderAvatarUpdateAction,
    ReminderEmailUpdateAction,
    ReminderFullNameUpdateAction,
    ReminderSheriffAllowAction,
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
import { settingsUpdate } from "state/settings/actions";
import { getSettingNode } from "state/settings/selectors";
import { flashBox } from "state/flashbox/actions";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import { deserializeSheriffs, serializeSheriffs } from "util/sheriff";

export default [
    executor("STORY_PINNING_UPDATE", null, storyPinningUpdateSaga),
    executor("STORY_VIEWING_UPDATE", null, storyViewingUpdateSaga),
    executor("STORY_READING_UPDATE", null, storyReadingUpdateSaga),
    executor("STORY_SATISFY", null, storySatisfySaga),
    executor("STORY_DELETE", null, storyDeleteSaga),
    executor("STORY_TYPE_BLOCK", null, storyTypeBlockSaga),
    executor("REMINDER_FULL_NAME_UPDATE", null, reminderFullNameUpdateSaga),
    executor("REMINDER_AVATAR_UPDATE", null, reminderAvatarUpdateSaga),
    executor("REMINDER_EMAIL_UPDATE", null, reminderEmailUpdateSaga),
    executor("REMINDER_SHERIFF_ALLOW", null, reminderSheriffAllowSaga),
];

async function storyPinningUpdateSaga(action: WithContext<StoryPinningUpdateAction>): Promise<void> {
    const {id, pinned} = action.payload;
    try {
        const story = await Node.updateStory(action, REL_CURRENT, id, {pinned});
        dispatch(storyUpdated(REL_CURRENT, story).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function storyViewingUpdateSaga(action: WithContext<StoryViewingUpdateAction>): Promise<void> {
    await homeIntroduced();
    const {nodeName, id, viewed} = action.payload;
    try {
        const story = await Node.updateStory(action, nodeName, id, {viewed});
        dispatch(storyUpdated(nodeName, story).causedBy(action));
    } catch (e) {
        // ignore, not important
    }
}

async function storyReadingUpdateSaga(action: WithContext<StoryReadingUpdateAction>): Promise<void> {
    await homeIntroduced();
    const {nodeName, id, read} = action.payload;
    try {
        const story = await Node.updateStory(action, nodeName, id, {read});
        dispatch(storyUpdated(nodeName, story).causedBy(action));
    } catch (e) {
        // ignore, not important
    }
}

async function storySatisfySaga(action: WithContext<StorySatisfyAction>): Promise<void> {
    const {nodeName, id} = action.payload;
    try {
        const story = await Node.updateStory(action, nodeName, id, {satisfied: true});
        dispatch(storyUpdated(nodeName, story).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function storyDeleteSaga(action: WithContext<StoryDeleteAction>): Promise<void> {
    const {nodeName, story} = action.payload;
    try {
        await Node.deleteStory(action, nodeName, story.id);
        dispatch(storyDeleted(nodeName, story).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function storyTypeBlockSaga(action: WithContext<StoryTypeBlockAction>): Promise<void> {
    const {nodeName, storyType} = action.payload;
    try {
        await Node.blockInstant(action, nodeName, {storyType});
        dispatch(
            flashBox(i18n.t("story-type-turned-off", {type: i18n.t("story-type-plural." + storyType)})).causedBy(action)
        );
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function reminderFullNameUpdateSaga(action: WithContext<ReminderFullNameUpdateAction>): Promise<void> {
    const {fullName} = action.payload;
    try {
        const profile = await Node.updateProfile(action, REL_HOME, {fullName});
        dispatch(flashBox(i18n.t("full-name-set")).causedBy(action));
        dispatch(profileSet(profile).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function reminderAvatarUpdateSaga(action: WithContext<ReminderAvatarUpdateAction>): Promise<void> {
    const {avatarId} = action.payload;
    try {
        const profile = await Node.updateProfile(action, REL_HOME, {avatarId});
        dispatch(flashBox(i18n.t("avatar-set")).causedBy(action));
        dispatch(profileSet(profile).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function reminderEmailUpdateSaga(action: WithContext<ReminderEmailUpdateAction>): Promise<void> {
    const {email} = action.payload;
    try {
        const profile = await Node.updateProfile(action, REL_HOME, {email});
        dispatch(flashBox(i18n.t("email-set")).causedBy(action));
        dispatch(profileSet(profile).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

function reminderSheriffAllowSaga(action: WithContext<ReminderSheriffAllowAction>): void {
    const sheriffs = select(state => deserializeSheriffs(getSettingNode(state, "sheriffs.timeline") as string));
    const updates: SettingInfo[] = [
        {name: "sheriffs.timeline", value: serializeSheriffs(sheriffs.concat(SHERIFF_GOOGLE_PLAY_TIMELINE))},
    ];
    dispatch(settingsUpdate(updates).causedBy(action));
    dispatch(flashBox(i18n.t("access-google-play-sheriff-granted")).causedBy(action));
}
