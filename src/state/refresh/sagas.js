import { delay, put } from 'redux-saga/effects';

import { refreshHide } from "state/refresh/actions";

export function* refreshShowSaga() {
    yield delay(2000);
    yield put(refreshHide());
}
