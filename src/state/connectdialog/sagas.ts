import { addMinutes } from 'date-fns';

import { executor } from "state/executor";
import { Node, NodeApiError, TooManyRequestsError } from "api";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
import {
    connectDialogMailAfter,
    ConnectDialogResetPasswordAction,
    connectDialogResetPasswordFailed,
    connectDialogSetEmailHint,
    connectDialogSetForm,
    ConnectDialogVerifyCodeAction,
    connectDialogVerifyCodeFailed
} from "state/connectdialog/actions";
import { delay } from "util/misc";

export default [
    executor("CONNECT_DIALOG_RESET_PASSWORD", payload => payload.location, connectDialogResetPasswordSaga),
    executor("CONNECT_DIALOG_VERIFY_CODE", payload => payload.location, connectDialogVerifyCodeSaga)
];

async function connectDialogResetPasswordSaga(action: WithContext<ConnectDialogResetPasswordAction>): Promise<void> {
    const {location} = action.payload;
    try {
        const hint = await Node.resetCredentials(action, location, ["credentials.email-not-set"]);
        dispatch(connectDialogSetEmailHint(hint.emailHint).causedBy(action));
        dispatch(connectDialogMailAfter(addMinutes(new Date(), 1)).causedBy(action));
        dispatch(connectDialogSetForm(location, "admin", "verify").causedBy(action));
    } catch (e) {
        let message = typeof(e) === "string" ? e : (e as any).message;
        if (e instanceof NodeApiError) {
            message = "email-not-set";
        }
        if (e instanceof TooManyRequestsError) {
            message = "too-many-password-reset-attempts";
            dispatch(connectDialogMailAfter(e.retryAfter).causedBy(action));
        }
        dispatch(connectDialogResetPasswordFailed(message).causedBy(action));
    }
}

async function connectDialogVerifyCodeSaga(action: WithContext<ConnectDialogVerifyCodeAction>): Promise<void> {
    const {location, resetToken} = action.payload;

    while (true) {
        try {
            const result = await Node.verifyCredentialsResetToken(action, location, {token: resetToken});
            if (result.correct) {
                dispatch(connectDialogSetForm(location, "admin", "reset").causedBy(action));
            } else {
                dispatch(connectDialogVerifyCodeFailed("invalid-secret-code").causedBy(action));
            }
            break;
        } catch (e) {
            if (e instanceof TooManyRequestsError) {
                await delay(1000);
                continue;
            }
            const message = typeof (e) === "string" ? e : (e as any).message;
            dispatch(connectDialogVerifyCodeFailed(message).causedBy(action));
            break;
        }
    }
}
