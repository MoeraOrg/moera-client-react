import { call, put, select } from 'redux-saga/effects';

import { Browser, Home } from "api";
import { errorThrown } from "state/error/actions";
import { cartesSet } from "state/cartes/actions";
import { getHomeConnectionData } from "state/home/selectors";

export function* cartesLoadSaga() {
    const {location, login, token, permissions} = yield select(getHomeConnectionData);
    try {
        const {cartes} = yield call(Home.getCartes);
        Browser.storeHomeData(location, login, token, permissions, cartes);
        yield put(cartesSet(cartes));
    } catch (e) {
        yield put(errorThrown(e));
    }
}
