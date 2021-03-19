import {
    CANCEL_CONNECT_DIALOG,
    CONNECT_DIALOG_SET_FORM,
    OPEN_CONNECT_DIALOG,
    RESTORE_CONNECT_DIALOG
} from "state/connectdialog/actions";
import { CONNECT_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";

const initialState = {
    show: false,
    location: "",
    login: "admin",
    form: "connect"
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_CONNECT_DIALOG:
            return {
                ...state,
                show: true,
                form: "connect"
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
                login: action.payload.login,
                show: false
            };

        case DISCONNECTED_FROM_HOME:
            return {
                ...state,
                location: action.payload.location || initialState.location,
                login: action.payload.login || initialState.login
            };

        case RESTORE_CONNECT_DIALOG:
            return {
                ...state,
                location: action.payload.location,
                login: action.payload.login
            };

        case CONNECT_DIALOG_SET_FORM:
            return {
                ...state,
                location: action.payload.location,
                login: action.payload.login,
                form: action.payload.form
            };

        default:
            return state;
    }
}
