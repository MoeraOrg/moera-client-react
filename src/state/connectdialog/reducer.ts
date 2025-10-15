import { NodeName } from "api";
import { ClientAction } from "state/action";
import { ConnectDialogState } from "state/connectdialog/state";

const initialState = {
    show: false,
    location: "",
    login: "admin",
    form: "connect" as const,
    resettingPassword: false,
    emailHint: "",
    backHref: "",
};

export default (state: ConnectDialogState = initialState, action: ClientAction): ConnectDialogState => {
    switch (action.type) {
        case "GO_TO_PAGE":
            if (action.payload.page === "connect") {
                return {
                    ...state,
                    form: "connect",
                    resettingPassword: false,
                    emailHint: "",
                    backHref: action.payload.details.backHref
                };
            }
            return state;

        case "OPEN_CONNECT_DIALOG":
            return {
                ...state,
                show: true,
                form: "connect",
                resettingPassword: false,
                emailHint: ""
            };

        case "CANCEL_CONNECT_DIALOG":
            return {
                ...state,
                show: false
            };

        case "CONNECT_TO_HOME":
            return {
                ...state,
                location: action.payload.location,
                login: action.payload.login
            };

        case "CONNECTED_TO_HOME":
            return {
                ...state,
                show: false,
                location: NodeName.shorten(action.payload.name) ?? action.payload.location,
                login: action.payload.login ?? ""
            }

        case "HOME_OWNER_SET":
            if (action.payload.name != null) {
                return {
                    ...state,
                    location: NodeName.shorten(action.payload.name)
                }
            } else {
                return state;
            }

        case "CONNECT_DIALOG_SET_FORM":
            return {
                ...state,
                location: action.payload.location,
                login: action.payload.login,
                form: action.payload.form,
                resettingPassword: false
            };

        case "CONNECT_DIALOG_RESET_PASSWORD":
            return {
                ...state,
                resettingPassword: true
            };

        case "CONNECT_DIALOG_RESET_PASSWORD_FAILED":
            return {
                ...state,
                resettingPassword: false
            };

        case "CONNECT_DIALOG_SET_EMAIL_HINT":
            return {
                ...state,
                emailHint: action.payload.emailHint
            };

        default:
            return state;
    }
}
