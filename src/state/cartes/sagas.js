import { call, put } from 'redux-saga/effects';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import { cartesSet } from "state/cartes/actions";
import { Browser } from "ui/browser";

export function* cartesLoadSaga() {
    try {
        const {cartesIp, cartes} = yield call(Node.getCartes, ":");
        Browser.storeCartesData(cartesIp, cartes);
        yield put(cartesSet(cartesIp, cartes));
    } catch (e) {
        yield put(errorThrown(e));
    }
}
