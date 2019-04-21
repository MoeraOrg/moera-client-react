import { delay, put } from 'redux-saga/effects';

import { pulse10Min, pulse1Min, pulse6H } from "state/pulse/actions";

export function* pulseSaga() {
    let count = 0;
    while (true) {
        yield put(pulse1Min());
        if (count % 10 === 0) {
            yield put(pulse10Min());
        }
        if (count % 360 === 0) {
            yield put(pulse6H());
        }
        yield delay(60000);
        count = (count + 1) % 360;
    }
}
