import { put, delay, select } from 'redux-saga/effects';

import { Browser, NodeApiError } from "api";
import { errorDismiss, errorShow } from "state/error/actions";
import { disconnectFromHome } from "state/home/actions";
import { messageBox } from "state/messagebox/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { getAddonApiVersion } from "state/home/selectors";

export function* errorSaga(action) {
    if (action.payload.e instanceof NodeApiError) {
        return;
    }

    const {message, messageVerbose, stack} = action.payload.e;
    if (stack) {
        console.error(stack);
    }
    yield put(errorShow(message, messageVerbose));
    yield delay(10000);
    yield put(errorDismiss());
}

export function* errorAuthInvalidSaga() {
    const {addonApiVersion, location, login} = yield select(state => ({
        addonApiVersion: getAddonApiVersion(state),
        location: state.home.root.location,
        login: state.home.login
    }));
    if (addonApiVersion >= 2) {
        Browser.deleteData(location);
    } else {
        Browser.storeHomeData(location, login, null, null, null, null);
    }
    yield put(disconnectFromHome(location, login));
    yield put(messageBox("You have been disconnected from your home node.", openConnectDialog()));
}
