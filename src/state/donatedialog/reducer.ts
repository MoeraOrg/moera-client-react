import { ClientAction } from "state/action";
import { DonateDialogState } from "state/donatedialog/state";

const initialState: DonateDialogState = {
    show: false,
    name: "",
    fullName: null,
    fundraisers: []
};

export default (state: DonateDialogState = initialState, action: ClientAction): DonateDialogState => {
    switch (action.type) {
        case "OPEN_DONATE_DIALOG":
            return {
                ...state,
                show: true,
                name: action.payload.name,
                fullName: action.payload.fullName,
                fundraisers: action.payload.fundraisers
            }

        case "CLOSE_DONATE_DIALOG":
            return {
                ...state,
                show: false
            }

        default:
            return state;
    }
}
