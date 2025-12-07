import { addMinutes } from 'date-fns';
import * as URI from 'uri-js';

import { executor } from "state/executor";
import { Node, NodeApiError, TooManyRequestsError } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { goToLocation } from "state/navigation/actions";
import {
    ConnectPageChangePasswordAction,
    connectPageChangePasswordFailed,
    connectPageMailAfter,
    ConnectPageResetPasswordAction,
    connectPageResetPasswordFailed,
    connectPageSetEmailHint,
    connectPageSetForm,
    ConnectPageVerifyCodeAction,
    connectPageVerifyCodeFailed
} from "state/connectpage/actions";
import { REL_HOME } from "util/rel-node-name";
import { delay } from "util/misc";
import { flashBox } from "state/flashbox/actions";
import i18n from "i18next";

export default [
    executor("CONNECT_PAGE_RESET_PASSWORD", payload => payload.location, connectPageResetPasswordSaga),
    executor("CONNECT_PAGE_VERIFY_CODE", payload => payload.location, connectPageVerifyCodeSaga),
    executor("CONNECT_PAGE_CHANGE_PASSWORD", "", connectPageChangePasswordSaga)
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

async function connectPageChangePasswordSaga(action: WithContext<ConnectPageChangePasswordAction>): Promise<void> {
    const {oldPassword, password} = action.payload;
    const backHref = select(state => state.connectPage.backHref);

    try {
        await Node.updateCredentials(
            action, REL_HOME, {oldPassword, login: "admin", password}, ["credentials.login-incorrect"]
        );
        dispatch(flashBox(i18n.t("password-changed")));
        const {path = null, query = null, fragment = null} = URI.parse(backHref);
        dispatch(goToLocation(path, query, fragment).causedBy(action));
    } catch (e) {
        if (!(e instanceof NodeApiError)) {
            dispatch(errorThrown(e));
        }
        dispatch(connectPageChangePasswordFailed("password-incorrect").causedBy(action));
    }
}
