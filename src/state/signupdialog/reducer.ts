import {
    CANCEL_SIGN_UP_DIALOG,
    OPEN_SIGN_UP_DIALOG,
    SIGN_UP,
    SIGN_UP_FAILED,
    SIGN_UP_STAGE_DOMAIN,
    SIGNED_UP
} from "state/signupdialog/actions";
import { SignUpDialogState } from "state/signupdialog/state";
import { ClientAction } from "state/action";

const initialState = {
    show: false,
    processing: false,
    stage: SIGN_UP_STAGE_DOMAIN,
    name: null,
    domain: null,
    password: null,
    email: null
};

export default (state: SignUpDialogState = initialState, action: ClientAction): SignUpDialogState => {
    switch (action.type) {
        case OPEN_SIGN_UP_DIALOG:
            return {
                ...initialState,
                show: true
            };

        case SIGNED_UP:
        case CANCEL_SIGN_UP_DIALOG:
            return {
                ...state,
                show: false
            };

        case SIGN_UP:
            return {
                ...state,
                processing: true,
                name: action.payload.name,
                domain: action.payload.domain,
                password: action.payload.password,
                email: action.payload.email
            };

        case SIGN_UP_FAILED:
            return {
                ...state,
                processing: false,
                stage: action.payload.stage
            };

        default:
            return state;
    }
}
