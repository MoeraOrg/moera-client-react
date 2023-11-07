import { actionWithPayload, ActionWithPayload } from "state/action-types";
import { StoryInfo } from "api";

export type StoryPinningUpdateAction = ActionWithPayload<"STORY_PINNING_UPDATE", {
    id: string;
    pinned: boolean;
}>;
export const storyPinningUpdate = (id: string, pinned: boolean): StoryPinningUpdateAction =>
    actionWithPayload("STORY_PINNING_UPDATE", {id, pinned});

export type StoryReadingUpdateAction = ActionWithPayload<"STORY_READING_UPDATE", {
    feedName: string;
    id: string;
    read: boolean;
}>;
export const storyReadingUpdate = (feedName: string, id: string, read: boolean): StoryReadingUpdateAction =>
    actionWithPayload("STORY_READING_UPDATE", {feedName, id, read});

export type StorySatisfyAction = ActionWithPayload<"STORY_SATISFY", {
    feedName: string;
    id: string;
}>;
export const storySatisfy = (feedName: string, id: string): StorySatisfyAction =>
    actionWithPayload("STORY_SATISFY", {feedName, id});

export type StoryAddedAction = ActionWithPayload<"STORY_ADDED", {
    story: StoryInfo;
}>;
export const storyAdded = (story: StoryInfo): StoryAddedAction =>
    actionWithPayload("STORY_ADDED", {story});

export type StoryDeletedAction = ActionWithPayload<"STORY_DELETED", {
    story: StoryInfo;
}>;
export const storyDeleted = (story: StoryInfo): StoryDeletedAction =>
    actionWithPayload("STORY_DELETED", {story});

export type StoryUpdatedAction = ActionWithPayload<"STORY_UPDATED", {
    story: StoryInfo;
}>;
export const storyUpdated = (story: StoryInfo): StoryUpdatedAction =>
    actionWithPayload("STORY_UPDATED", {story});

export type StoriesAnyAction =
    StoryPinningUpdateAction
    | StoryReadingUpdateAction
    | StorySatisfyAction
    | StoryAddedAction
    | StoryDeletedAction
    | StoryUpdatedAction;
