import { addMinutes } from 'date-fns';

import { executor } from "state/executor";
import { Node, NodeApiError, TooManyRequestsError } from "api";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
import {
    connectPageMailAfter,
    ConnectPageResetPasswordAction,
    connectPageResetPasswordFailed,
    connectPageSetEmailHint,
    connectPageSetForm,
    ConnectPageVerifyCodeAction,
    connectPageVerifyCodeFailed
} from "state/connectpage/actions";
import { delay } from "util/misc";

export default [
    executor("CONNECT_PAGE_RESET_PASSWORD", payload => payload.location, connectPageResetPasswordSaga),
    executor("CONNECT_PAGE_VERIFY_CODE", payload => payload.location, connectPageVerifyCodeSaga)
];

async function connectPageResetPasswordSaga(action: WithContext<ConnectPageResetPasswordAction>): Promise<void> {
    const {location} = action.payload;
    try {
        const hint = await Node.resetCredentials(action, location, ["credentials.email-not-set"]);
        dispatch(connectPageSetEmailHint(hint.emailHint).causedBy(action));
        dispatch(connectPageMailAfter(addMinutes(new Date(), 1)).causedBy(action));
        dispatch(connectPageSetForm(location, "admin", "verify").causedBy(action));
    } catch (e) {
        let message = typeof(e) === "string" ? e : (e as any).message;
        if (e instanceof NodeApiError) {
            message = "email-not-set";
        }
        if (e instanceof TooManyRequestsError) {
            message = "too-many-password-reset-attempts";
            dispatch(connectPageMailAfter(e.retryAfter).causedBy(action));
        }
        dispatch(connectPageResetPasswordFailed(message).causedBy(action));
    }
}

async function connectPageVerifyCodeSaga(action: WithContext<ConnectPageVerifyCodeAction>): Promise<void> {
    const {location, resetToken} = action.payload;

    while (true) {
        try {
            const result = await Node.verifyCredentialsResetToken(action, location, {token: resetToken});
            if (result.correct) {
                dispatch(connectPageSetForm(location, "admin", "reset").causedBy(action));
            } else {
                dispatch(connectPageVerifyCodeFailed("invalid-verification-code").causedBy(action));
            }
            break;
        } catch (e) {
            if (e instanceof TooManyRequestsError) {
                await delay(1000);
                continue;
            }
            const message = typeof (e) === "string" ? e : (e as any).message;
            dispatch(connectPageVerifyCodeFailed(message).causedBy(action));
            break;
        }
    }
}
