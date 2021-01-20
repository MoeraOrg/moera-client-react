import { delay, put, select } from 'redux-saga/effects';

import { NodeApiError } from "api";
import { ERROR_AUTH_INVALID, ERROR_THROWN, errorDismiss, errorShow } from "state/error/actions";
import { disconnectFromHome } from "state/home/actions";
import { messageBox } from "state/messagebox/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { Browser } from "ui/browser";
import { getHomeRootLocation } from "state/home/selectors";
import { executor } from "state/executor";

export default [
    executor(ERROR_THROWN, "", errorSaga),
    executor(ERROR_AUTH_INVALID, "", errorAuthInvalidSaga)
];

function* errorSaga(action) {
    if (action.payload.e instanceof NodeApiError) {
        return;
    }

    let {message, messageVerbose, stack} = action.payload.e;
    if (stack) {
        console.error(stack);
    }
    if (!message) {
        message = messageVerbose = action.payload.e.toString();
    }
    yield put(errorShow(message, messageVerbose));
    yield delay(10000);
    yield put(errorDismiss());
}

function* errorAuthInvalidSaga() {
    const {location, login} = yield select(state => ({
        location: getHomeRootLocation(state),
        login: state.home.login
    }));
    Browser.deleteData(location);
    yield put(disconnectFromHome(location, login));
    yield put(messageBox("You have been disconnected from your home node.", openConnectDialog()));
}
