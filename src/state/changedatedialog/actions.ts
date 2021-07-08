import { ActionBase } from "state/action-base";

export const OPEN_CHANGE_DATE_DIALOG = "OPEN_CHANGE_DATE_DIALOG";
type OpenChangeDateDialogAction = ActionBase<typeof OPEN_CHANGE_DATE_DIALOG, {
    storyId: string;
    publishedAt: number;
}>;
export const openChangeDateDialog = (storyId: string, publishedAt: number): OpenChangeDateDialogAction => ({
    type: OPEN_CHANGE_DATE_DIALOG,
    payload: {storyId, publishedAt}
});

export const CLOSE_CHANGE_DATE_DIALOG = "CLOSE_CHANGE_DATE_DIALOG";
type CloseChangeDateDialogAction = ActionBase<typeof CLOSE_CHANGE_DATE_DIALOG, never>;
export const closeChangeDateDialog = (): CloseChangeDateDialogAction => ({
    type: CLOSE_CHANGE_DATE_DIALOG
});

export const STORY_CHANGE_DATE = "STORY_CHANGE_DATE";
type StoryChangeDateAction = ActionBase<typeof STORY_CHANGE_DATE, {
    id: string;
    publishedAt: number;
}>;
export const storyChangeDate = (id: string, publishedAt: number): StoryChangeDateAction => ({
    type: STORY_CHANGE_DATE,
    payload: {id, publishedAt}
});

export const STORY_CHANGE_DATE_FAILED = "STORY_CHANGE_DATE_FAILED";
type StoryChangeDateFailedAction = ActionBase<typeof STORY_CHANGE_DATE_FAILED, never>;
export const storyChangeDateFailed = (): StoryChangeDateFailedAction => ({
    type: STORY_CHANGE_DATE_FAILED
});

export type ChangeDateDialogAction = OpenChangeDateDialogAction | CloseChangeDateDialogAction | StoryChangeDateAction
    | StoryChangeDateFailedAction;
