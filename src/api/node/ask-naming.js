import { buffers, channel } from 'redux-saga';
import { call, flush, put, select } from 'redux-saga/effects';

import { isCartesInitialized } from "state/cartes/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { isSettingsClientValuesLoaded } from "state/settings/selectors";

const postponingChannel = channel(buffers.expanding(10));

function canRun(state) {
    return isSettingsClientValuesLoaded(state) || (isCartesInitialized(state) && !isConnectedToHome(state));
}

export function askNaming(saga) {
    return function* (action) {
        if (yield select(canRun)) {
            yield call(saga, action);
            return;
        }
        yield put(postponingChannel, action);
    }
}

export function* flushPostponedNamingSaga() {
    if (yield select(canRun)) {
        const actions = yield flush(postponingChannel);
        for (let action of actions) {
            yield put(action);
        }
    }
}
