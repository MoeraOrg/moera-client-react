import {
    CANCEL_CONNECT_DIALOG,
    CONNECT_DIALOG_RESET_PASSWORD,
    CONNECT_DIALOG_RESET_PASSWORD_FAILED,
    CONNECT_DIALOG_SET_EMAIL_HINT,
    CONNECT_DIALOG_SET_FORM,
    OPEN_CONNECT_DIALOG
} from "state/connectdialog/actions";
import { CONNECT_TO_HOME, CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { ConnectDialogState } from "state/connectdialog/state";
import { ClientAction } from "state/action";

const initialState = {
    show: false,
    location: "",
    login: "admin",
    form: "connect" as const,
    resettingPassword: false,
    emailHint: ""
};

export default (state: ConnectDialogState = initialState, action: ClientAction): ConnectDialogState => {
    switch (action.type) {
        case OPEN_CONNECT_DIALOG:
            return {
                ...state,
                show: true,
                form: "connect",
                resettingPassword: false,
                emailHint: ""
            };

        case CANCEL_CONNECT_DIALOG:
            return {
                ...state,
                show: false
            };

        case CONNECT_TO_HOME:
            return {
                ...state,
                location: action.payload.location,
                login: action.payload.login
            };

        case CONNECTED_TO_HOME:
            return {
                ...state,
                show: false,
                location: action.payload.location,
                login: action.payload.login ?? ""
            }

        case DISCONNECTED_FROM_HOME:
            return {
                ...state,
                location: action.payload.location || initialState.location,
                login: action.payload.login || initialState.login
            };

        case CONNECT_DIALOG_SET_FORM:
            return {
                ...state,
                location: action.payload.location,
                login: action.payload.login,
                form: action.payload.form,
                resettingPassword: false
            };

        case CONNECT_DIALOG_RESET_PASSWORD:
            return {
                ...state,
                resettingPassword: true
            };

        case CONNECT_DIALOG_RESET_PASSWORD_FAILED:
            return {
                ...state,
                resettingPassword: false
            };

        case CONNECT_DIALOG_SET_EMAIL_HINT:
            return {
                ...state,
                emailHint: action.payload.emailHint
            };

        default:
            return state;
    }
}
