import { SourceDialogState } from "state/sourcedialog/state";
import { ClientAction } from "state/action";

const initialState: SourceDialogState = {
    show: false,
    text: "",
    loading: false
}

export default (state: SourceDialogState = initialState, action: ClientAction): SourceDialogState => {
    switch (action.type) {
        case "OPEN_SOURCE_DIALOG":
            return {
                ...state,
                show: true,
                loading: true
            }

        case "CLOSE_SOURCE_DIALOG":
            return {
                ...state,
                show: false
            }

        case "SOURCE_DIALOG_LOADED":
            return {
                ...state,
                loading: false,
                text: action.payload.text
            }

        case "SOURCE_DIALOG_LOAD_FAILED":
            return {
                ...state,
                loading: false
            }

        default:
            return state;
    }
}
