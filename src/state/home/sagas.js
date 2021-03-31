import { call, put } from 'redux-saga/effects';

import { Node } from "api";
import { restoreConnectDialog } from "state/connectdialog/actions";
import { browserApiSet, connectedToHome, disconnectFromHome, HOME_RESTORE } from "state/home/actions";
import { getCartesListTtl } from "state/cartes/selectors";
import { errorThrown } from "state/error/actions";
import { Browser } from "ui/browser";
import { normalizeUrl } from "util/url";
import { executor } from "state/executor";
import { now } from "util/misc";

export default [
    executor(HOME_RESTORE, null, homeRestoreSaga)
];

function* homeRestoreSaga(action) {
    let {addonApiVersion, location, login, token, permissions, cartesIp, cartes, roots} = action.payload;
    let createdAt = now();

    addonApiVersion = addonApiVersion ?? 1;
    yield put(browserApiSet(addonApiVersion));

    if (token) {
        yield put(restoreConnectDialog(location, login));
        if (getCartesListTtl(cartes) < 5 * 60) {
            try {
                const data = yield call(Node.getCartes, normalizeUrl(location), token);
                cartesIp = data.cartesIp;
                cartes = data.cartes;
                createdAt = data.createdAt;
                Browser.storeCartesData(cartesIp, cartes);
            } catch (e) {
                yield put(errorThrown(e));
            }
        }
        yield put(connectedToHome(location, login, token, permissions, cartesIp, cartes, roots, createdAt - now()));
    } else {
        yield put(disconnectFromHome(location, login));
    }
}
