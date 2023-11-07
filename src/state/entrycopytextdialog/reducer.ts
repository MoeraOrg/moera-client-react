import { ClientAction } from "state/action";
import { EntryCopyTextDialogState } from "state/entrycopytextdialog/state";

const initialState = {
    show: false,
    body: null,
    nodeName: "",
    media: null
}

export default (state: EntryCopyTextDialogState = initialState, action: ClientAction): EntryCopyTextDialogState => {
    switch (action.type) {
        case "OPEN_ENTRY_COPY_TEXT_DIALOG":
            return {
                ...state,
                show: true,
                body: action.payload.body,
                nodeName: action.payload.nodeName,
                media: action.payload.media
            }

        case "CLOSE_ENTRY_COPY_TEXT_DIALOG":
            return {
                ...state,
                show: false
            }

        default:
            return state;
    }
}
