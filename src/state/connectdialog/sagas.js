import { call, put } from 'redux-saga/effects';

import { executor } from "state/executor";
import { Node, NodeApiError } from "api";
import { errorThrown } from "state/error/actions";
import {
    CONNECT_DIALOG_RESET_PASSWORD,
    connectDialogResetPasswordFailed,
    connectDialogSetForm
} from "state/connectdialog/actions";
import { messageBox } from "state/messagebox/actions";

export default [
    executor(CONNECT_DIALOG_RESET_PASSWORD, payload => payload.location, connectDialogResetPasswordSaga)
];

function* connectDialogResetPasswordSaga(action) {
    const {location} = action.payload;
    try {
        yield call(Node.postCredentialsReset, location);
        yield put(connectDialogSetForm(location, "admin", "reset"));
    } catch (e) {
        yield put(connectDialogResetPasswordFailed());
        if (e instanceof NodeApiError) {
            yield put(messageBox(
                `Unfortunately, E-mail address for node <b>${location}</b> is not set, so automatic password`
                + " reset is impossible. Please, contact your Moera provider or server owner to find alternative ways"
                + " to reset the password."));
        } else {
            yield put(errorThrown(e));
        }
    }
}
