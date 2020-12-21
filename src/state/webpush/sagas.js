import { apply, call, put } from 'redux-saga/effects';
import * as Base64js from 'base64-js';

import { Node } from "api";
import { errorThrown } from "state/error/actions";

export function* webPushSubscribeSaga() {
    try {
        const data = yield call(Node.getWebPushKey, ":");
        const registration = yield call(() => navigator.serviceWorker.ready);
        const subscription = yield apply(registration.pushManager, "subscribe", [{
            userVisibleOnly: true,
            applicationServerKey: Base64js.toByteArray(data.key)
        }]);
        console.log(subscription);
    } catch (e) {
        yield put(errorThrown(e));
    }
}
