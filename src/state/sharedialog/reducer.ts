import { CLOSE_SHARE_DIALOG, OPEN_SHARE_DIALOG } from "state/sharedialog/actions";
import { ShareDialogState } from "state/sharedialog/state";
import { ClientAction } from "state/action";

const initialState = {
    show: false,
    title: "",
    url: null
}

export default (state: ShareDialogState = initialState, action: ClientAction): ShareDialogState => {
    switch (action.type) {
        case OPEN_SHARE_DIALOG:
            return {
                ...state,
                show: true,
                title: action.payload.title,
                url: action.payload.url
            }

        case CLOSE_SHARE_DIALOG:
            return {
                ...state,
                show: false
            }

        default:
            return state;
    }
}
