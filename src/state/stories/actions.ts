import { actionWithPayload, ActionWithPayload } from "state/action-types";
import { StoryInfo, StoryType } from "api";
import { RelNodeName } from "util/rel-node-name";

export type StoryPinningUpdateAction = ActionWithPayload<"STORY_PINNING_UPDATE", {
    id: string;
    pinned: boolean;
}>;
export const storyPinningUpdate = (id: string, pinned: boolean): StoryPinningUpdateAction =>
    actionWithPayload("STORY_PINNING_UPDATE", {id, pinned});

export type StoryViewingUpdateAction = ActionWithPayload<"STORY_VIEWING_UPDATE", {
    nodeName: RelNodeName | string;
    feedName: string;
    id: string;
    viewed: boolean;
}>;
export const storyViewingUpdate = (
    nodeName: RelNodeName | string, feedName: string, id: string, viewed: boolean
): StoryViewingUpdateAction =>
    actionWithPayload("STORY_VIEWING_UPDATE", {nodeName, feedName, id, viewed});

export type StoryReadingUpdateAction = ActionWithPayload<"STORY_READING_UPDATE", {
    nodeName: RelNodeName | string;
    feedName: string;
    id: string;
    read: boolean;
}>;
export const storyReadingUpdate = (
    nodeName: RelNodeName | string, feedName: string, id: string, read: boolean
): StoryReadingUpdateAction =>
    actionWithPayload("STORY_READING_UPDATE", {nodeName, feedName, id, read});

export type StorySatisfyAction = ActionWithPayload<"STORY_SATISFY", {
    nodeName: RelNodeName | string;
    feedName: string;
    id: string;
}>;
export const storySatisfy = (nodeName: RelNodeName | string, feedName: string, id: string): StorySatisfyAction =>
    actionWithPayload("STORY_SATISFY", {nodeName, feedName, id});

export type StoryAddedAction = ActionWithPayload<"STORY_ADDED", {
    nodeName: RelNodeName | string;
    story: StoryInfo;
}>;
export const storyAdded = (nodeName: RelNodeName | string, story: StoryInfo): StoryAddedAction =>
    actionWithPayload("STORY_ADDED", {nodeName, story});

export type StoryDeleteAction = ActionWithPayload<"STORY_DELETE", {
    nodeName: RelNodeName | string;
    story: StoryInfo;
}>;
export const storyDelete = (nodeName: RelNodeName | string, story: StoryInfo): StoryDeleteAction =>
    actionWithPayload("STORY_DELETE", {nodeName, story});

export type StoryDeletedAction = ActionWithPayload<"STORY_DELETED", {
    nodeName: RelNodeName | string;
    story: StoryInfo;
}>;
export const storyDeleted = (nodeName: RelNodeName | string, story: StoryInfo): StoryDeletedAction =>
    actionWithPayload("STORY_DELETED", {nodeName, story});

export type StoryUpdatedAction = ActionWithPayload<"STORY_UPDATED", {
    nodeName: RelNodeName | string;
    story: StoryInfo;
}>;
export const storyUpdated = (nodeName: RelNodeName | string, story: StoryInfo): StoryUpdatedAction =>
    actionWithPayload("STORY_UPDATED", {nodeName, story});

export type StoryTypeBlockAction = ActionWithPayload<"STORY_TYPE_BLOCK", {
    nodeName: RelNodeName | string;
    storyType: StoryType;
}>;
export const storyTypeBlock = (nodeName: RelNodeName | string, storyType: StoryType): StoryTypeBlockAction =>
    actionWithPayload("STORY_TYPE_BLOCK", {nodeName, storyType});

export type ReminderFullNameUpdateAction = ActionWithPayload<"REMINDER_FULL_NAME_UPDATE", {
    fullName: string;
}>;
export const reminderFullNameUpdate = (fullName: string): ReminderFullNameUpdateAction =>
    actionWithPayload("REMINDER_FULL_NAME_UPDATE", {fullName});

export type ReminderAvatarUpdateAction = ActionWithPayload<"REMINDER_AVATAR_UPDATE", {
    avatarId: string;
}>;
export const reminderAvatarUpdate = (avatarId: string): ReminderAvatarUpdateAction =>
    actionWithPayload("REMINDER_AVATAR_UPDATE", {avatarId});

export type StoriesAnyAction =
    StoryPinningUpdateAction
    | StoryViewingUpdateAction
    | StoryReadingUpdateAction
    | StorySatisfyAction
    | StoryAddedAction
    | StoryDeleteAction
    | StoryDeletedAction
    | StoryUpdatedAction
    | StoryTypeBlockAction
    | ReminderFullNameUpdateAction
    | ReminderAvatarUpdateAction;
