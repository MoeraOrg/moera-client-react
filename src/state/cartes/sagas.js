import { call, put } from 'redux-saga/effects';

import { Browser, Home } from "api";
import { errorThrown } from "state/error/actions";
import { cartesSet } from "state/cartes/actions";

export function* cartesLoadSaga() {
    try {
        const data = yield call(Home.getCartes);
        Browser.storeCartes(data.cartes);
        yield put(cartesSet(data.cartes));
    } catch (e) {
        yield put(errorThrown(e));
    }
}
