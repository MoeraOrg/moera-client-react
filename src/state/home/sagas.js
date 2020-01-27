import { call, put } from 'redux-saga/effects';

import { Browser, Home } from "api";
import { restoreConnectDialog } from "state/connectdialog/actions";
import { connectedToHome, disconnectFromHome } from "state/home/actions";
import { getCartesListTtl } from "state/cartes/selectors";
import { errorThrown } from "state/error/actions";
import { normalizeUrl } from "util/misc";

export function* homeRestoreSaga(action) {
    let {location, login, token, permissions, cartes} = action.payload;

    if (token) {
        yield put(restoreConnectDialog(location, login));
        if (getCartesListTtl(cartes) < 5 * 60) {
            const rootApi = normalizeUrl(location) + "/moera/api";
            try {
                cartes = yield call(Home.getCartes, rootApi, token).cartes;
                Browser.storeHomeData(location, login, token, permissions, cartes);
            } catch (e) {
                yield put(errorThrown(e));
            }
        }
        yield put(connectedToHome(location, login, token, permissions, cartes));
    } else {
        yield put(disconnectFromHome(location, login));
    }
}
