import { NodeName } from "api";
import { ClientAction } from "state/action";
import { ConnectPageState } from "state/connectpage/state";

const initialState: ConnectPageState = {
    location: "",
    login: "admin",
    form: "connect" as const,
    processing: false,
    emailHint: "",
    resetToken: null,
    backHref: "",
    lastError: null,
    formId: 0,
    connectAfter: new Date(),
    mailAfter: new Date()
};

export default (state: ConnectPageState = initialState, action: ClientAction): ConnectPageState => {
    switch (action.type) {
        case "GO_TO_PAGE":
            if (action.payload.page === "connect") {
                return {
                    ...state,
                    form: "connect",
                    processing: false,
                    emailHint: "",
                    backHref: action.payload.details.backHref,
                    lastError: null,
                    formId: state.formId + 1
                };
            }
            return state;

        case "CONNECT_TO_HOME":
            return {
                ...state,
                location: action.payload.location,
                login: action.payload.login,
                lastError: null,
                formId: state.formId + 1
            };

        case "CONNECTED_TO_HOME":
            return {
                ...state,
                location: NodeName.shorten(action.payload.name) ?? action.payload.location,
                login: action.payload.login ?? "",
                lastError: null,
                formId: state.formId + 1
            }

        case "CONNECTION_TO_HOME_FAILED":
            return {
                ...state,
                lastError: action.payload.error,
                formId: state.formId + 1
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

        case "CONNECT_PAGE_SET_FORM":
            return {
                ...state,
                location: action.payload.location ?? state.location,
                login: action.payload.login ?? state.login,
                form: action.payload.form,
                processing: false,
                lastError: null,
                formId: state.formId + 1
            };

        case "CONNECT_PAGE_RESET_PASSWORD":
            return {
                ...state,
                processing: true
            };

        case "CONNECT_PAGE_RESET_PASSWORD_FAILED":
            return {
                ...state,
                lastError: action.payload.error,
                processing: false,
                formId: state.formId + 1
            };

        case "CONNECT_PAGE_VERIFY_CODE":
            return {
                ...state,
                resetToken: action.payload.resetToken,
                processing: true
            };

        case "CONNECT_PAGE_VERIFY_CODE_FAILED":
            return {
                ...state,
                lastError: action.payload.error,
                processing: false,
                formId: state.formId + 1
            };

        case "CONNECT_PAGE_SET_EMAIL_HINT":
            return {
                ...state,
                emailHint: action.payload.emailHint
            };

        case "CONNECT_PAGE_CONNECT_AFTER":
            return {
                ...state,
                connectAfter: action.payload.after
            };

        case "CONNECT_PAGE_MAIL_AFTER":
            return {
                ...state,
                mailAfter: action.payload.after
            };

        case "CONNECT_PAGE_CHANGE_PASSWORD":
            return {
                ...state,
                processing: true
            };

        case "CONNECT_PAGE_CHANGE_PASSWORD_FAILED":
            return {
                ...state,
                lastError: action.payload.error,
                processing: false,
                formId: state.formId + 1
            };

        default:
            return state;
    }
}
