import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type OpenChangeDateDialogAction = ActionWithPayload<"OPEN_CHANGE_DATE_DIALOG", {
    storyId: string;
    publishedAt: number;
}>;
export const openChangeDateDialog = (storyId: string, publishedAt: number): OpenChangeDateDialogAction =>
    actionWithPayload("OPEN_CHANGE_DATE_DIALOG", {storyId, publishedAt});

export type CloseChangeDateDialogAction = ActionWithoutPayload<"CLOSE_CHANGE_DATE_DIALOG">;
export const closeChangeDateDialog = (): CloseChangeDateDialogAction =>
    actionWithoutPayload("CLOSE_CHANGE_DATE_DIALOG");

export type StoryChangeDateAction = ActionWithPayload<"STORY_CHANGE_DATE", {
    id: string;
    publishedAt: number;
}>;
export const storyChangeDate = (id: string, publishedAt: number): StoryChangeDateAction =>
    actionWithPayload("STORY_CHANGE_DATE", {id, publishedAt});

export type StoryChangeDateFailedAction = ActionWithoutPayload<"STORY_CHANGE_DATE_FAILED">;
export const storyChangeDateFailed = (): StoryChangeDateFailedAction =>
    actionWithoutPayload("STORY_CHANGE_DATE_FAILED");

export type ChangeDateDialogAnyAction =
    OpenChangeDateDialogAction
    | CloseChangeDateDialogAction
    | StoryChangeDateAction
    | StoryChangeDateFailedAction;
