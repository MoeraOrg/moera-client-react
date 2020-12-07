import { delay, put, select } from 'redux-saga/effects';

import { NodeApiError } from "api";
import { errorDismiss, errorShow } from "state/error/actions";
import { disconnectFromHome } from "state/home/actions";
import { messageBox } from "state/messagebox/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { Browser } from "ui/browser";

export function* errorSaga(action) {
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

export function* errorAuthInvalidSaga() {
    const {location, login} = yield select(state => ({
        location: state.home.root.location,
        login: state.home.login
    }));
    Browser.deleteData(location);
    yield put(disconnectFromHome(location, login));
    yield put(messageBox("You have been disconnected from your home node.", openConnectDialog()));
}
