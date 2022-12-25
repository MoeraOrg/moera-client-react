import { ClientAction } from "state/action";
import { ProgressBoxState } from "state/progressbox/state";
import { CLOSE_PROGRESS_BOX, OPEN_PROGRESS_BOX, UPDATE_PROGRESS_BOX } from "state/progressbox/actions";

const initialState = {
    show: false,
    done: 0,
    total: 0
};

export default (state: ProgressBoxState = initialState, action: ClientAction): ProgressBoxState => {
    switch (action.type) {
        case OPEN_PROGRESS_BOX:
            return {
                ...state,
                show: true,
                done: action.payload.done,
                total: action.payload.total
            };

        case UPDATE_PROGRESS_BOX:
            return {
                ...state,
                done: action.payload.done,
                total: action.payload.total
            };

        case CLOSE_PROGRESS_BOX:
            return {
                ...state,
                show: false
            };

        default:
            return state;
    }
}
