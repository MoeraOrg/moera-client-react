import { delay, put, select } from 'typed-redux-saga';
import i18n from 'i18next';

import { NodeApiError, VerboseError } from "api";
import { CausedError } from "api/error";
import { Storage } from "storage";
import { errorDismiss, errorShow, ErrorThrownAction } from "state/error/actions";
import { messageBox } from "state/messagebox/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { getHomeRootLocation } from "state/home/selectors";
import { executor } from "state/executor";

export default [
    executor("ERROR_THROWN", "", errorThrownSaga),
    executor("ERROR_AUTH_INVALID", "", errorAuthInvalidSaga)
];

function* errorThrownSaga(action: ErrorThrownAction) {
    const err = action.payload.e;
    if (err instanceof NodeApiError) {
        return;
    }

    let message: string | null = null;
    let messageVerbose: string | null = null;

    if (err instanceof Error) {
        message = err.message;
    }
    if (!message) {
        message = err.toString();
    }
    console.error(message);

    if (err instanceof VerboseError) {
        messageVerbose = err.messageVerbose;
    }
    if (messageVerbose) {
        console.error(messageVerbose);
    }

    if (err instanceof CausedError) {
        for (let cause = err.cause; cause != null; cause = cause.cause) {
            const causedBy = `Caused by ${cause.type}`;
            messageVerbose = messageVerbose != null ? messageVerbose + "\n" + causedBy : causedBy;
            console.error(causedBy, cause);
        }
    }

    if (document.visibilityState !== "visible") {
        return;
    }

    yield* delay(1000);
    yield* put(errorShow(message ?? "", messageVerbose));
    yield* delay(10000);
    yield* put(errorDismiss());
}

function* errorAuthInvalidSaga() {
    const location = yield* select(getHomeRootLocation);
    if (location != null) {
        Storage.deleteData(location);
        yield* put(messageBox(i18n.t("disconnected-from-home"), openConnectDialog()));
    }
}
