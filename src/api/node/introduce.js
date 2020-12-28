import { buffers, channel } from 'redux-saga';
import { call, flush, put, select } from 'redux-saga/effects';

import { isAtHomeNode } from "state/node/selectors";
import { isCartesInitialized, isCartesRunOut } from "state/cartes/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { cartesLoad } from "state/cartes/actions";

const postponingChannel = channel(buffers.expanding(10));

function canRun(state, action, isHomeStuff) {
    if (isHomeStuff != null && isConnectedToHome(state)
        && (typeof(isHomeStuff) === "function" ? isHomeStuff(action, state) : !!isHomeStuff)) {

        return true;
    }
    return isAtHomeNode(state) || !isCartesRunOut(state) || (isCartesInitialized(state) && !isConnectedToHome(state));
}

export function introduce(saga, isHomeStuff = null) {
    return function* (action) {
        if (yield select(state => canRun(state, action, isHomeStuff))) {
            yield call(saga, action);
            return;
        }
        if (yield select(isCartesInitialized)) {
            yield put(cartesLoad());
        }
        yield put(postponingChannel, action);
    }
}

export function* flushPostponedIntroducedSaga() {
    if (yield select(canRun)) {
        const actions = yield flush(postponingChannel);
        for (let action of actions) {
            yield put(action);
        }
    }
}
