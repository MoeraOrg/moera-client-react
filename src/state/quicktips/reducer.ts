import { CLOSE_QUICK_TIPS, OPEN_QUICK_TIPS } from "state/quicktips/actions";
import { QuickTipsState } from "state/quicktips/state";
import { ClientAction } from "state/action";

const initialState = {
    show: false
};

export default (state: QuickTipsState = initialState, action: ClientAction): QuickTipsState => {
    switch (action.type) {
        case OPEN_QUICK_TIPS:
            return {
                ...state,
                show: true
            };

        case CLOSE_QUICK_TIPS:
            return {
                ...state,
                show: false
            };

        default:
            return state;
    }
}
