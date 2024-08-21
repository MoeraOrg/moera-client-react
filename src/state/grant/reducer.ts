import { GrantState } from "state/grant/state";
import { ClientAction } from "state/action";

const initialState: GrantState = {
    clientName: "",
    carte: "",
    scopes: [],
    redirectUri: null,
    validated: false,
    valid: false,
    validationError: null,
    confirming: false,
    confirmed: false
};

export default (state: GrantState = initialState, action: ClientAction): GrantState => {
    switch (action.type) {
        case "GO_TO_PAGE":
            if (action.payload.page === "grant") {
                return {
                    ...initialState,
                    clientName: action.payload.details.clientName,
                    carte: action.payload.details.carte,
                    scopes: action.payload.details.scope,
                    redirectUri: action.payload.details.redirectUri
                }
            }
            return state;

        case "GRANT_VALIDATED":
            return {
                ...state,
                validated: true,
                valid: action.payload.valid,
                validationError: action.payload.error
            }

        case "GRANT_CONFIRM":
            return {
                ...state,
                confirming: true
            }

        case "GRANT_CONFIRMED":
            return {
                ...state,
                confirming: false,
                confirmed: true
            }

        case "GRANT_CONFIRM_FAILED":
            return {
                ...state,
                confirming: false
            }

        default:
            return state;
    }
}
