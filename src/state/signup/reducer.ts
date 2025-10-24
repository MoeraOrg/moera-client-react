import { SIGN_UP_STAGE_DOMAIN } from "state/signup/actions";
import { SignUpState } from "state/signup/state";
import { ClientAction } from "state/action";

const initialState: SignUpState = {
    mode: "quick",
    processing: false,
    stage: SIGN_UP_STAGE_DOMAIN,
    name: null,
    domain: null,
    password: null,
    email: null,
    backHref: ""
};

export default (state: SignUpState = initialState, action: ClientAction): SignUpState => {
    switch (action.type) {
        case "GO_TO_PAGE":
            if (action.payload.page === "connect") {
                return {
                    ...initialState,
                    backHref: action.payload.details.backHref
                };
            }
            return state;

        case "SIGN_UP":
            return {
                ...state,
                processing: true,
                mode: action.payload.mode,
                name: action.payload.name,
                domain: action.payload.domain,
                password: action.payload.password,
                email: action.payload.email
            };

        case "SIGN_UP_FAILED":
            return {
                ...state,
                processing: false,
                stage: action.payload.stage
            };

        default:
            return state;
    }
}
