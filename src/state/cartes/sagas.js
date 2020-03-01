import { call, put, select } from 'redux-saga/effects';

import { Browser, Home } from "api";
import { errorThrown } from "state/error/actions";
import { cartesSet } from "state/cartes/actions";
import { getHomeConnectionData } from "state/home/selectors";

export function* cartesLoadSaga() {
    const {addonApiVersion, location, login, token, permissions} = yield select(getHomeConnectionData);
    try {
        const {cartesIp, cartes} = yield call(Home.getCartes);
        if (addonApiVersion >= 2) {
            Browser.storeCartesData(cartesIp, cartes);
        } else {
            Browser.storeHomeData(location, login, token, permissions, cartesIp, cartes);
        }
        yield put(cartesSet(cartesIp, cartes));
    } catch (e) {
        yield put(errorThrown(e));
    }
}
