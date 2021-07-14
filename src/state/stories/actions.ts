import { ActionWithPayload } from "state/action-types";
import { StoryInfo } from "api/node/api-types";

export const STORY_PINNING_UPDATE = "STORY_PINNING_UPDATE";
export type StoryPinningUpdateAction = ActionWithPayload<typeof STORY_PINNING_UPDATE, {
    id: string;
    pinned: boolean;
}>;
export const storyPinningUpdate = (id: string, pinned: boolean): StoryPinningUpdateAction => ({
    type: STORY_PINNING_UPDATE,
    payload: {id, pinned}
});

export const STORY_READING_UPDATE = "STORY_READING_UPDATE";
export type StoryReadingUpdateAction = ActionWithPayload<typeof STORY_READING_UPDATE, {
    feedName: string;
    id: string;
    read: boolean;
}>;
export const storyReadingUpdate = (feedName: string, id: string, read: boolean): StoryReadingUpdateAction => ({
    type: STORY_READING_UPDATE,
    payload: {feedName, id, read}
});

export const STORY_ADDED = "STORY_ADDED";
export type StoryAddedAction = ActionWithPayload<typeof STORY_ADDED, {
    story: StoryInfo;
}>;
export const storyAdded = (story: StoryInfo): StoryAddedAction => ({
    type: STORY_ADDED,
    payload: {story}
});

export const STORY_DELETED = "STORY_DELETED";
export type StoryDeletedAction = ActionWithPayload<typeof STORY_DELETED, {
    story: StoryInfo;
}>;
export const storyDeleted = (story: StoryInfo): StoryDeletedAction => ({
    type: STORY_DELETED,
    payload: {story}
});

export const STORY_UPDATED = "STORY_UPDATED";
export type StoryUpdatedAction = ActionWithPayload<typeof STORY_UPDATED, {
    story: StoryInfo;
}>;
export const storyUpdated = (story: StoryInfo): StoryUpdatedAction => ({
    type: STORY_UPDATED,
    payload: {story}
});

export type StoriesAnyAction =
    StoryPinningUpdateAction
    | StoryReadingUpdateAction
    | StoryAddedAction
    | StoryDeletedAction
    | StoryUpdatedAction;
