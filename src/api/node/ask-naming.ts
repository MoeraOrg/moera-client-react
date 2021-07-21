import { Action } from 'redux';
import { buffers, channel, Channel } from 'redux-saga';
import { call, flush, put, select } from 'typed-redux-saga/macro';

import { isCartesInitialized } from "state/cartes/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { isSettingsClientValuesLoaded } from "state/settings/selectors";
import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { ExecutorSaga } from "state/executor";

const postponingChannel: Channel<Action<string>> = channel(buffers.expanding(10));

function canRun(state: ClientState) {
    return isSettingsClientValuesLoaded(state) || (isCartesInitialized(state) && !isConnectedToHome(state));
}

export function askNaming<A extends ClientAction>(saga: ExecutorSaga<A>): ExecutorSaga<A> {
    return function* (action) {
        if (yield* select(canRun)) {
            yield* call(saga, action);
            return;
        }
        yield* put(postponingChannel, action);
    }
}

export function* flushPostponedNamingSaga() {
    if (yield* select(canRun)) {
        const actions = yield* flush<Action<string>>(postponingChannel);
        for (let action of actions) {
            yield* put(action);
        }
    }
}
