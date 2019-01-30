import { select, call, put, apply } from 'redux-saga/effects';

import { ownerNameSet, ownerNameVerified } from "mainmenu/ownerActions";
import { getCurrentSaga } from "naming/namingSaga";

export function* ownerNameLoadSaga() {
    const {rootApi, rootPage} = yield select(state => ({
        rootApi: state.root.api,
        rootPage:  state.root.page}));
    const response = yield call(fetch, rootApi + "/profile");
    const data = yield apply(response, response.json);
    yield put(ownerNameSet(data.registeredName, data.registeredNameGeneration));
    if (data.registeredName == null) {
        return;
    }
    const ndata = yield* getCurrentSaga(data.registeredName, data.registeredNameGeneration);
    const correct = rootPage.startsWith(ndata.nodeUri) && rootApi.startsWith(ndata.nodeUri);
    yield put(ownerNameVerified(data.registeredName, data.registeredNameGeneration, ndata.latest, correct));
}
