import { delay, put } from 'redux-saga/effects';

import { flashBoxClose, flashBoxDismiss } from "state/flashbox/actions";

export function* flashBoxSaga() {
    yield delay(1000);
    yield put(flashBoxDismiss());
    yield delay(1000);
    yield put(flashBoxClose());
}
