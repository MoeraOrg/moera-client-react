import { select, call, put, apply } from 'redux-saga/effects';

import { ownerNameSet } from "mainmenu/ownerActions";

export function* ownerNameLoadSaga() {
    const rootApi = yield select(state => state.root.api);
    const response = yield call(fetch, rootApi + "/profile");
    const data = yield apply(response, response.json);
    yield put(ownerNameSet(data.registeredName, data.registeredNameGeneration))
}
