import { call, apply } from 'redux-saga/effects';

export function* getCurrentSaga(name, generation) {
    const response = yield call(fetch, "http://localhost.localdomain:8081/moera-naming", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getCurrent",
            params: [name, generation]
        })
    });
    return (yield apply(response, response.json)).result;
}
