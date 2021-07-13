import { ActionWithPayload } from "state/action-base";
import { Action } from "redux";

export const OPEN_CHANGE_DATE_DIALOG = "OPEN_CHANGE_DATE_DIALOG";
type OpenChangeDateDialogAction = ActionWithPayload<typeof OPEN_CHANGE_DATE_DIALOG, {
    storyId: string;
    publishedAt: number;
}>;
export const openChangeDateDialog = (storyId: string, publishedAt: number): OpenChangeDateDialogAction => ({
    type: OPEN_CHANGE_DATE_DIALOG,
    payload: {storyId, publishedAt}
});

export const CLOSE_CHANGE_DATE_DIALOG = "CLOSE_CHANGE_DATE_DIALOG";
type CloseChangeDateDialogAction = Action<typeof CLOSE_CHANGE_DATE_DIALOG>;
export const closeChangeDateDialog = (): CloseChangeDateDialogAction => ({
    type: CLOSE_CHANGE_DATE_DIALOG
});

export const STORY_CHANGE_DATE = "STORY_CHANGE_DATE";
type StoryChangeDateAction = ActionWithPayload<typeof STORY_CHANGE_DATE, {
    id: string;
    publishedAt: number;
}>;
export const storyChangeDate = (id: string, publishedAt: number): StoryChangeDateAction => ({
    type: STORY_CHANGE_DATE,
    payload: {id, publishedAt}
});

export const STORY_CHANGE_DATE_FAILED = "STORY_CHANGE_DATE_FAILED";
type StoryChangeDateFailedAction = Action<typeof STORY_CHANGE_DATE_FAILED>;
export const storyChangeDateFailed = (): StoryChangeDateFailedAction => ({
    type: STORY_CHANGE_DATE_FAILED
});

export type ChangeDateDialogAnyAction =
    OpenChangeDateDialogAction
    | CloseChangeDateDialogAction
    | StoryChangeDateAction
    | StoryChangeDateFailedAction;
