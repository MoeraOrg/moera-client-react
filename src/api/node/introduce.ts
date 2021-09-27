import { Action } from 'redux';
import { buffers, Channel, channel } from 'redux-saga';
import { call, flush, put, select } from 'typed-redux-saga/macro';

import { isAtHomeNode } from "state/node/selectors";
import { isCartesInitialized, isCartesRunOut } from "state/cartes/selectors";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { cartesLoad } from "state/cartes/actions";
import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { ExecutorSaga } from "state/executor";
import { WithContext } from "state/action-types";
import getContext from "state/context";

const postponingChannel: Channel<WithContext<Action<string>>> = channel(buffers.expanding(10));

function canRun(state: ClientState) {
    return isAtHomeNode(state) || !isCartesRunOut(state)
        || (isCartesInitialized(state)
            && (!isConnectedToHome(state) || (isConnectedToHome(state) && !isHomeOwnerNameSet(state))));
}

export function introduce<A extends ClientAction>(saga: ExecutorSaga<A>): ExecutorSaga<A> {
    return function* (action) {
        if (yield* select(canRun)) {
            yield* call(saga, action);
            return;
        }
        if (yield* select(isCartesInitialized)) {
            yield* put(cartesLoad());
        }
        yield* put(postponingChannel, action);
    }
}

export function* flushPostponedIntroducedSaga() {
    if (yield* select(canRun)) {
        const context = yield* select(getContext);
        const actions = yield* flush(postponingChannel);
        for (let action of actions) {
            action.context = context;
            yield* put(action);
        }
    }
}
