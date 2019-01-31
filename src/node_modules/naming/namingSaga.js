import { select, call, apply } from 'redux-saga/effects';

let callId = 1;

function* callNaming(method, ...params) {
    const location = yield select(state => state.naming.location);
    const response = yield call(fetch, location, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: callId++,
            method,
            params
        })
    });
    return (yield apply(response, response.json)).result;
}

export function* getCurrentSaga(name, generation) {
    return yield* callNaming("getCurrent", name, generation);
}
