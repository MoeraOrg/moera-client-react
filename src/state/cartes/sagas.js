import { call, put } from 'redux-saga/effects';

import { Browser, Node } from "api";
import { errorThrown } from "state/error/actions";
import { cartesSet } from "state/cartes/actions";

export function* cartesLoadSaga() {
    try {
        const {cartesIp, cartes} = yield call(Node.getCartes, ":");
        Browser.storeCartesData(cartesIp, cartes);
        yield put(cartesSet(cartesIp, cartes));
    } catch (e) {
        yield put(errorThrown(e));
    }
}
