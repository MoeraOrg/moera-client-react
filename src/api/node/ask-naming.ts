import { Action } from 'redux';
import { buffers, channel, Channel } from 'redux-saga';
import { call, flush, put, select } from 'typed-redux-saga/macro';

import { isCartesInitialized } from "state/cartes/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { isSettingsClientValuesLoaded } from "state/settings/selectors";
import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { ExecutorSaga } from "state/executor";
import { WithContext } from "state/action-types";
import getContext from "state/context";

const postponingChannel: Channel<WithContext<Action<string>>> = channel(buffers.expanding(10));

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
        const context = yield* select(getContext);
        const actions = yield* flush(postponingChannel);
        for (let action of actions) {
            action.context = context;
            yield* put(action);
        }
    }
}
