export const STORY_PINNING_UPDATE = "STORY_PINNING_UPDATE";
export const storyPinningUpdate = (id, pinned) => ({
    type: STORY_PINNING_UPDATE,
    payload: {id, pinned}
});

export const STORY_ADDED = "STORY_ADDED";
export const storyAdded = (story) => ({
    type: STORY_ADDED,
    payload: {story}
});

export const STORY_DELETED = "STORY_DELETED";
export const storyDeleted = (story) => ({
    type: STORY_DELETED,
    payload: {story}
});

export const STORY_UPDATED = "STORY_UPDATED";
export const storyUpdated = (story) => ({
    type: STORY_UPDATED,
    payload: {story}
});
