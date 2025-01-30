import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

import { ClientState } from "state/state";
import { ClientAction, ClientActionType } from "state/action";
import { WithContext } from "state/action-types";
import getContext from "state/context";
import { BarrierCondition } from "state/store-sagas";
import { invokeTriggers, TriggerMap } from "state/trigger";

interface Barrier {
    actions: ClientActionType[];
    condition: BarrierCondition;
    resolve: () => void | PromiseLike<void>;
}

export type StoreMiddlewareApi = MiddlewareAPI<Dispatch<ClientAction>, ClientState>;

export interface StoreMiddleware extends Middleware<{}, ClientState> {
    barrier: (actions: ClientActionType[], condition: BarrierCondition) => Promise<void>;
}

export function createStoreMiddleware(triggers: TriggerMap): StoreMiddleware {
    const barriers = new Map<ClientActionType, Barrier[]>();

    const addBarrier = (actions: ClientActionType[], condition: BarrierCondition): Promise<void> => {
        return new Promise(resolve => {
            const barrier: Barrier = {actions, condition, resolve};
            for (const action of actions) {
                const list = barriers.get(action) ?? [];
                list.push(barrier);
                barriers.set(action, list);
            }
        });
    }

    const deleteBarrier = (barrier: Barrier): void => {
        for (const action of barrier.actions) {
            const list = barriers.get(action) ?? [];
            const index = list.indexOf(barrier);
            if (index >= 0) {
                list.splice(index, 1);
                barriers.set(action, list);
            }
        }
    }

    const resolveBarriers = (state: ClientState, action: WithContext<ClientAction>): void => {
        const list = barriers.get(action.type) ?? [];
        for (const barrier of list) {
            if (barrier.condition === true || barrier.condition(state, action)) {
                barrier.resolve();
                deleteBarrier(barrier);
            }
        }
    }

    const middleware: StoreMiddleware = storeApi => next => (action: WithContext<ClientAction>) => {
        const result = next(action);

        action.context = getContext(storeApi.getState());
        resolveBarriers(storeApi.getState(), action);
        invokeTriggers(triggers, action, storeApi);

        return result;
    }
    middleware.barrier = addBarrier;

    return middleware;
}
