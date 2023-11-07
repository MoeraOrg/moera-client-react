import { ClientAction } from "state/action";
import { PeopleHideDialogState } from "state/peoplehidedialog/state";

const initialState = {
    show: false,
    nodeName: null,
    feedName: null
};

export default (state: PeopleHideDialogState = initialState, action: ClientAction): PeopleHideDialogState => {
    switch (action.type) {
        case "OPEN_PEOPLE_HIDE_DIALOG":
            return {
                ...state,
                show: true,
                nodeName: action.payload.nodeName,
                feedName: action.payload.feedName,
            }

        case "CLOSE_PEOPLE_HIDE_DIALOG":
            return {
                ...state,
                show: false
            }

        default:
            return state;
    }
}
