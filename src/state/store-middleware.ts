import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { DynamicActionContext } from "state/context";
import { BarrierActionType, BarrierCondition } from "state/store-sagas";
import { invokeTriggers, TriggerMap } from "state/trigger";
import { ExecutorMap, invokeExecutor } from "state/executor";

interface Barrier {
    actions: BarrierActionType[];
    condition: BarrierCondition;
    resolve: (action: WithContext<ClientAction> | null) => void | PromiseLike<WithContext<ClientAction> | null>;
    timeout?: number | NodeJS.Timeout;
}

export type StoreMiddlewareApi = MiddlewareAPI<Dispatch<ClientAction>, ClientState>;

export interface StoreMiddleware extends Middleware<{}, ClientState> {
    barrier: (
        actions: BarrierActionType[], condition: BarrierCondition, timeoutMs?: number
    ) => Promise<ClientAction | null>;
}

export function createStoreMiddleware(triggers: TriggerMap, executors: ExecutorMap): StoreMiddleware {
    const barriers = new Map<BarrierActionType, Barrier[]>();

    const addBarrier = (
        actions: BarrierActionType[], condition: BarrierCondition, timeoutMs?: number
    ): Promise<ClientAction | null> => {
        return new Promise(resolve => {
            const barrier: Barrier = {actions, condition, resolve};
            for (const action of actions) {
                const list = barriers.get(action) ?? [];
                list.push(barrier);
                barriers.set(action, list);
            }
            if (timeoutMs != null) {
                barrier.timeout = setTimeout(() => deleteBarrier(barrier), timeoutMs);
            }
        });
    }

    const deleteBarrier = (barrier: Barrier): void => {
        if (barrier.timeout != null) {
            barrier.resolve(null);
            clearTimeout(barrier.timeout);
        }
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
        const list = (barriers.get(action.type) ?? []).concat(barriers.get("*") ?? []);
        for (const barrier of list) {
            if (barrier.condition === true || barrier.condition(state, action)) {
                barrier.resolve(action);
                deleteBarrier(barrier);
            }
        }
    }

    const middleware: StoreMiddleware = storeApi => next => (action: WithContext<ClientAction>) => {
        const result = next(action);

        action.context = new DynamicActionContext();
        resolveBarriers(storeApi.getState(), action);
        invokeTriggers(triggers, action, storeApi);
        invokeExecutor(executors, action, storeApi);

        return result;
    }
    middleware.barrier = addBarrier;

    return middleware;
}
