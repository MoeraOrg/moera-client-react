import { select, call, put, apply } from 'redux-saga/effects';

import { ownerNameSet, ownerNameVerified } from "mainmenu/ownerActions";
import { getCurrentSaga } from "naming/saga";

export function* ownerNameLoadSaga() {
    const rootApi = yield select(state => state.root.api);
    const response = yield call(fetch, rootApi + "/profile");
    const data = yield apply(response, response.json);
    yield put(ownerNameSet(data.registeredName, data.registeredNameGeneration));
    if (data.registeredName == null) {
        return;
    }
    const ndata = yield* getCurrentSaga(data.registeredName, data.registeredNameGeneration);
    const rootPage = yield select(state => state.root.page);
    const correct = rootPage.startsWith(ndata.nodeUri) && rootApi.startsWith(ndata.nodeUri);
    yield put(ownerNameVerified(data.registeredName, data.registeredNameGeneration, ndata.latest, correct));
}
