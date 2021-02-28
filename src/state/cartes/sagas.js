import { call, put } from 'redux-saga/effects';

import { Node, NodeApiError } from "api";
import { errorThrown } from "state/error/actions";
import { CARTES_LOAD, cartesSet } from "state/cartes/actions";
import { Browser } from "ui/browser";
import { executor } from "state/executor";

export default [
    executor(CARTES_LOAD, "", cartesLoadSaga)
];

function* cartesLoadSaga() {
    try {
        const {cartesIp, cartes} = yield call(Node.getCartes, ":");
        Browser.storeCartesData(cartesIp, cartes);
        yield put(cartesSet(cartesIp, cartes));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield put(cartesSet(null, null));
        } else {
            yield put(errorThrown(e));
        }
    }
}
