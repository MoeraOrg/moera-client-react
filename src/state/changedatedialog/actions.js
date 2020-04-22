export const OPEN_CHANGE_DATE_DIALOG = "OPEN_CHANGE_DATE_DIALOG";
export const openChangeDateDialog = (storyId, publishedAt) => ({
    type: OPEN_CHANGE_DATE_DIALOG,
    payload: {storyId, publishedAt}
});

export const CLOSE_CHANGE_DATE_DIALOG = "CLOSE_CHANGE_DATE_DIALOG";
export const closeChangeDateDialog = () => ({
    type: CLOSE_CHANGE_DATE_DIALOG
});

export const STORY_CHANGE_DATE = "STORY_CHANGE_DATE";
export const storyChangeDate = (id, publishedAt) => ({
    type: STORY_CHANGE_DATE,
    payload: {id, publishedAt}
});

export const STORY_CHANGE_DATE_FAILED = "STORY_CHANGE_DATE_FAILED";
export const storyChangeDateFailed = () => ({
    type: STORY_CHANGE_DATE_FAILED
});
