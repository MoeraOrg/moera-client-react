import { delay, put, race, take } from 'redux-saga/effects';

import { postInit, postInitDelayed, pulse10Min, pulse1Min, pulse6H } from "state/pulse/actions";

export function* signalPostInitSaga() {
    yield delay(1000);
    while (true) {
        const { debounced } = yield race({
            debounced: delay(1000),
            latestAction: take("*")
        });

        if (debounced) {
            yield put(postInit());
            yield delay(5000);
            yield put(postInitDelayed());
            return;
        }
    }
}

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
