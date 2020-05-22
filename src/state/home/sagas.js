import { call, put } from 'redux-saga/effects';

import { Browser, Node } from "api";
import { restoreConnectDialog } from "state/connectdialog/actions";
import { browserApiSet, connectedToHome, disconnectFromHome } from "state/home/actions";
import { getCartesListTtl } from "state/cartes/selectors";
import { errorThrown } from "state/error/actions";
import { normalizeUrl } from "util/misc";

export function* homeRestoreSaga(action) {
    let {addonApiVersion, location, login, token, permissions, cartesIp, cartes, roots} = action.payload;

    addonApiVersion = addonApiVersion ?? 1;
    yield put(browserApiSet(addonApiVersion));

    if (token) {
        yield put(restoreConnectDialog(location, login));
        if (getCartesListTtl(cartes) < 5 * 60) {
            const rootApi = normalizeUrl(location) + "/moera/api";
            try {
                const data = yield call(Node.getCartes, rootApi, token);
                cartesIp = data.cartesIp;
                cartes = data.cartes;
                if (addonApiVersion >= 2) {
                    Browser.storeCartesData(cartesIp, cartes);
                } else {
                    Browser.storeHomeData(location, login, token, permissions, cartesIp, cartes);
                }
            } catch (e) {
                yield put(errorThrown(e));
            }
        }
        yield put(connectedToHome(location, login, token, permissions, cartesIp, cartes, roots));
    } else {
        yield put(disconnectFromHome(location, login));
    }
}
