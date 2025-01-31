import i18n from 'i18next';

import { executor } from "state/executor";
import { Node, NodeApiError } from "api";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
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

async function connectDialogResetPasswordSaga(action: WithContext<ConnectDialogResetPasswordAction>): Promise<void> {
    const {location} = action.payload;
    try {
        const hint = await Node.resetCredentials(action, location, ["credentials.email-not-set"]);
        dispatch(connectDialogSetEmailHint(hint.emailHint).causedBy(action));
        dispatch(connectDialogSetForm(location, "admin", "reset").causedBy(action));
    } catch (e) {
        dispatch(connectDialogResetPasswordFailed().causedBy(action));
        if (e instanceof NodeApiError) {
            dispatch(messageBox(i18n.t("email-not-set", {location})).causedBy(action));
        } else {
            dispatch(errorThrown(e));
        }
    }
}
