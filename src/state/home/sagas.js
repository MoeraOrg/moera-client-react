import { call, put } from 'redux-saga/effects';

import { Node } from "api";
import { restoreConnectDialog } from "state/connectdialog/actions";
import { browserApiSet, connectedToHome, disconnectFromHome } from "state/home/actions";
import { getCartesListTtl } from "state/cartes/selectors";
import { errorThrown } from "state/error/actions";
import { Browser } from "ui/browser";
import { normalizeUrl } from "util/misc";

export function* homeRestoreSaga(action) {
    let {addonApiVersion, location, login, token, permissions, cartesIp, cartes, roots} = action.payload;

    addonApiVersion = addonApiVersion ?? 1;
    yield put(browserApiSet(addonApiVersion));

    if (token) {
        yield put(restoreConnectDialog(location, login));
        if (getCartesListTtl(cartes) < 5 * 60) {
            try {
                const {cartesIp, cartes} = yield call(Node.getCartes, normalizeUrl(location), token);
                Browser.storeCartesData(cartesIp, cartes);
            } catch (e) {
                yield put(errorThrown(e));
            }
        }
        yield put(connectedToHome(location, login, token, permissions, cartesIp, cartes, roots));
    } else {
        yield put(disconnectFromHome(location, login));
    }
}
