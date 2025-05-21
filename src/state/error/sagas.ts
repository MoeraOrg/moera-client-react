import i18n from 'i18next';

import { NameResolvingError, NodeApiError, VerboseError } from "api";
import { CausedError, NodeConnectionError } from "api/error";
import { Storage } from "storage";
import { errorDismiss, errorShow, ErrorThrownAction } from "state/error/actions";
import { messageBox } from "state/messagebox/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { getHomeRootLocation } from "state/home/selectors";
import { executor } from "state/executor";
import { dispatch, select } from "state/store-sagas";
import { delay } from "util/misc";

export default [
    executor("ERROR_THROWN", "", errorThrownSaga),
    executor("ERROR_AUTH_INVALID", "", errorAuthInvalidSaga)
];

async function errorThrownSaga(action: ErrorThrownAction): Promise<void> {
    const err = action.payload.e;
    if (err instanceof NodeApiError && !err.errorCode.startsWith("carte.")) {
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
    if (err instanceof NodeConnectionError || err instanceof NameResolvingError || err instanceof NodeApiError) {
        return;
    }

    await delay(1000);
    dispatch(errorShow(message ?? "", messageVerbose));
    await delay(10000);
    dispatch(errorDismiss());
}

function errorAuthInvalidSaga(): void {
    const location = select(getHomeRootLocation);
    if (location != null) {
        Storage.deleteData(location);
        dispatch(messageBox(i18n.t("disconnected-from-home"), openConnectDialog()));
    }
}
