import { ClientAction } from "state/action";
import { CLOSE_DONATE_DIALOG, OPEN_DONATE_DIALOG } from "state/donatedialog/actions";
import { DonateDialogState } from "state/donatedialog/state";

const initialState = {
    show: false,
    name: "",
    fullName: null,
    fundraisers: []
};

export default (state: DonateDialogState = initialState, action: ClientAction): DonateDialogState => {
    switch (action.type) {
        case OPEN_DONATE_DIALOG:
            return {
                ...state,
                show: true,
                name: action.payload.name,
                fullName: action.payload.fullName,
                fundraisers: action.payload.fundraisers
            }

        case CLOSE_DONATE_DIALOG:
            return {
                ...state,
                show: false
            }

        default:
            return state;
    }
}
