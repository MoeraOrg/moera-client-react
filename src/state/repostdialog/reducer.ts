import { ClientAction } from "state/action";
import { RepostDialogState } from "state/repostdialog/state";
import { REL_CURRENT } from "util/rel-node-name";

const initialState: RepostDialogState = {
    show: false,
    nodeName: REL_CURRENT,
    fullName: null,
    postingId: null,
    heading: null,
    visible: "public",
    submitting: false
};

export default (state: RepostDialogState = initialState, action: ClientAction): RepostDialogState => {
    switch (action.type) {
        case "OPEN_REPOST_DIALOG":
            return {
                ...initialState,
                show: true,
                nodeName: action.payload.nodeName,
                fullName: action.payload.fullName,
                postingId: action.payload.postingId,
                heading: action.payload.heading,
                visible: action.payload.visible,
            };

        case "CLOSE_REPOST_DIALOG":
            return {
                ...state,
                show: false
            };

        case "REPOST_POSTING":
            return {
                ...state,
                submitting: true
            };

        case "REPOST_POSTING_SUCCEEDED":
            return {
                ...state,
                show: false,
                submitting: false
            };

        case "REPOST_POSTING_FAILED":
            return {
                ...state,
                submitting: false
            };

        default:
            return state;
    }
};
