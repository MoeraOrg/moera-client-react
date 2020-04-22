import {
    CLOSE_CHANGE_DATE_DIALOG,
    OPEN_CHANGE_DATE_DIALOG,
    STORY_CHANGE_DATE,
    STORY_CHANGE_DATE_FAILED
} from "state/changedatedialog/actions";

const initialState = {
    show: false,
    storyId: null,
    publishedAt: 0,
    changing: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_CHANGE_DATE_DIALOG:
            return {
                ...state,
                show: true,
                storyId: action.payload.storyId,
                publishedAt: action.payload.publishedAt,
                changing: false
            }

        case CLOSE_CHANGE_DATE_DIALOG:
            return {
                ...state,
                publishedAt: 0,
                changing: false,
                show: false
            }

        case STORY_CHANGE_DATE:
            return {
                ...state,
                changing: true
            }

        case STORY_CHANGE_DATE_FAILED:
            return {
                ...state,
                changing: false
            }

        default:
            return state;
    }
}
