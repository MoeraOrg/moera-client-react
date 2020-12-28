import { apply, call, put, select } from 'redux-saga/effects';
import * as Base64js from 'base64-js';

import { Node, NodeApiError } from "api";
import { errorThrown } from "state/error/actions";
import { Browser } from "ui/browser";
import { webPushSubscriptionSet } from "state/webpush/actions";
import { getWebPushSubscriptionId } from "state/webpush/selectors";

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
        const registration = yield call(() => navigator.serviceWorker.ready);
        const subscription = yield apply(registration.pushManager, "getSubscription");
        if (subscription != null) {
            yield apply(subscription, "unsubscribe");
        }
        const subscriptionId = yield select(getWebPushSubscriptionId);
        if (subscriptionId != null) {
            try {
                yield call(Node.deleteWebPushSubscription, ":", subscriptionId);
            } catch (e) {
                if (!(e instanceof NodeApiError)) {
                    throw e;
                }
            }
            Browser.storeWebPushData(null);
            yield put(webPushSubscriptionSet(null));
        }
    } catch (e) {
        yield put(errorThrown(e));
    }
}
