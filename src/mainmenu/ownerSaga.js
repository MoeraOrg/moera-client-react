import { select, call, put, apply, delay } from 'redux-saga/effects';

import { ownerNameSet, ownerNameVerified } from "mainmenu/ownerActions";

export function* ownerNameLoadSaga() {
    const rootApi = yield select(state => state.root.api);
    const response = yield call(fetch, rootApi + "/profile");
    const data = yield apply(response, response.json);
    yield put(ownerNameSet(data.registeredName, data.registeredNameGeneration));
    if (data.registeredName == null) {
        return;
    }
    yield delay(3000);
    yield put(ownerNameVerified(data.registeredName, data.registeredNameGeneration, true, false));
}
