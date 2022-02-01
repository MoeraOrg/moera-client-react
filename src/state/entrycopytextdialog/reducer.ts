import { ClientAction } from "state/action";
import { EntryCopyTextDialogState } from "state/entrycopytextdialog/state";
import { CLOSE_ENTRY_COPY_TEXT_DIALOG, OPEN_ENTRY_COPY_TEXT_DIALOG } from "state/entrycopytextdialog/actions";

const initialState = {
    show: false,
    body: null
}

export default (state: EntryCopyTextDialogState = initialState, action: ClientAction): EntryCopyTextDialogState => {
    switch (action.type) {
        case OPEN_ENTRY_COPY_TEXT_DIALOG:
            return {
                ...state,
                show: true,
                body: action.payload.body
            }

        case CLOSE_ENTRY_COPY_TEXT_DIALOG:
            return {
                ...state,
                show: false
            }

        default:
            return state;
    }
}
