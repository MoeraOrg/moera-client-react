import { delay, put, select } from 'typed-redux-saga';
import i18n from 'i18next';

import { NodeApiError, VerboseError } from "api";
import { Storage } from "storage";
import { ERROR_AUTH_INVALID, ERROR_THROWN, errorDismiss, errorShow, ErrorThrownAction } from "state/error/actions";
import { disconnectFromHome } from "state/home/actions";
import { messageBox } from "state/messagebox/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { getHomeRootLocation } from "state/home/selectors";
import { executor } from "state/executor";

export default [
    executor(ERROR_THROWN, "", errorSaga),
    executor(ERROR_AUTH_INVALID, "", errorAuthInvalidSaga)
];

function* errorSaga(action: ErrorThrownAction) {
    const err = action.payload.e;
    if (err instanceof NodeApiError) {
        return;
    }

    let {message, stack} = err;
    let messageVerbose = null;
    if (!message) {
        message = messageVerbose = err.toString();
    } else if (err instanceof VerboseError) {
        messageVerbose = err.messageVerbose;
    }

    if (stack) {
        console.error(stack);
    }

    if (document.visibilityState !== "visible") {
        return;
    }

    yield* delay(1000);
    yield* put(errorShow(message, messageVerbose));
    yield* delay(10000);
    yield* put(errorDismiss());
}

function* errorAuthInvalidSaga() {
    const {location, login} = yield* select(state => ({
        location: getHomeRootLocation(state),
        login: state.home.login
    }));
    if (location != null) {
        Storage.deleteData(location);
        yield* put(disconnectFromHome(location, login));
        yield* put(messageBox(i18n.t("disconnected-from-home"), openConnectDialog()));
    }
}
