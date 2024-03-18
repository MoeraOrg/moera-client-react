import { call, put } from 'typed-redux-saga';
import i18n from 'i18next';

import { executor } from "state/executor";
import { Node, NodeApiError } from "api";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import {
    ConnectDialogResetPasswordAction,
    connectDialogResetPasswordFailed,
    connectDialogSetEmailHint,
    connectDialogSetForm
} from "state/connectdialog/actions";
import { messageBox } from "state/messagebox/actions";

export default [
    executor("CONNECT_DIALOG_RESET_PASSWORD", payload => payload.location, connectDialogResetPasswordSaga)
];

function* connectDialogResetPasswordSaga(action: WithContext<ConnectDialogResetPasswordAction>) {
    const {location} = action.payload;
    try {
        const hint = yield* call(Node.resetCredentials, action, location, ["credentials.email-not-set"]);
        yield* put(connectDialogSetEmailHint(hint.emailHint).causedBy(action));
        yield* put(connectDialogSetForm(location, "admin", "reset").causedBy(action));
    } catch (e) {
        yield* put(connectDialogResetPasswordFailed().causedBy(action));
        if (e instanceof NodeApiError) {
            yield* put(messageBox(i18n.t("email-not-set", {location})).causedBy(action));
        } else {
            yield* put(errorThrown(e));
        }
    }
}
