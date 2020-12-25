import { apply, call, put } from 'redux-saga/effects';
import * as Base64js from 'base64-js';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import { Browser } from "ui/browser";
import { webPushSubscriptionSet } from "state/webpush/actions";

export function* webPushSubscribeSaga() {
    try {
        const data = yield call(Node.getWebPushKey, ":");
        const registration = yield call(() => navigator.serviceWorker.ready);
        const subscription = yield apply(registration.pushManager, "subscribe", [{
            userVisibleOnly: true,
            applicationServerKey: Base64js.toByteArray(data.key)
        }]);
        if (subscription == null) {
            return;
        }
        const publicKey = Base64js.fromByteArray(new Uint8Array(subscription.getKey("p256dh")));
        const authKey = Base64js.fromByteArray(new Uint8Array(subscription.getKey("auth")));
        const {id: subscriptionId} = yield call(Node.postWebPushSubscription, ":", subscription.endpoint,
            publicKey, authKey);
        if (subscriptionId != null) {
            Browser.storeWebPushData(subscriptionId);
            yield put(webPushSubscriptionSet(subscriptionId));
        }
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* webPushUnsubscribeSaga() {
    try {
        Browser.storeWebPushData(null);
        yield put(webPushSubscriptionSet(null));
    } catch (e) {
        yield put(errorThrown(e));
    }
}