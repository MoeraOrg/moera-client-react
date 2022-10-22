import { call, put } from 'typed-redux-saga';
import i18n from 'i18next';

import { executor } from "state/executor";
import { Node, NodeApiError } from "api";
import { errorThrown } from "state/error/actions";
import {
    CONNECT_DIALOG_RESET_PASSWORD,
    ConnectDialogResetPasswordAction,
    connectDialogResetPasswordFailed,
    connectDialogSetEmailHint,
    connectDialogSetForm
} from "state/connectdialog/actions";
import { messageBox } from "state/messagebox/actions";

export default [
    executor(CONNECT_DIALOG_RESET_PASSWORD, payload => payload.location, connectDialogResetPasswordSaga)
];

function* connectDialogResetPasswordSaga(action: ConnectDialogResetPasswordAction) {
    const {location} = action.payload;
    try {
        const data = yield* call(Node.postCredentialsReset, location);
        yield* put(connectDialogSetEmailHint(data.emailHint));
        yield* put(connectDialogSetForm(location, "admin", "reset"));
    } catch (e) {
        yield* put(connectDialogResetPasswordFailed());
        if (e instanceof NodeApiError) {
            yield* put(messageBox(i18n.t("email-not-set", {location})));
        } else {
            yield* put(errorThrown(e));
        }
    }
}
