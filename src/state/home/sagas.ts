import { call, put, select } from 'typed-redux-saga';

import { Node } from "api";
import { getCartes } from "api/node/cartes";
import { restoreConnectDialog } from "state/connectdialog/actions";
import {
    browserApiSet,
    connectedToHome,
    disconnectFromHome,
    HOME_AVATARS_LOAD,
    HOME_RESTORE,
    homeAvatarsLoaded,
    homeAvatarsLoadFailed,
    HomeRestoreAction
} from "state/home/actions";
import { errorThrown } from "state/error/actions";
import { getCartesListTtl } from "state/cartes/selectors";
import { getHomeRootLocation } from "state/home/selectors";
import { executor } from "state/executor";
import { Browser } from "ui/browser";
import { normalizeUrl } from "util/url";
import { now } from "util/misc";

export default [
    executor(HOME_RESTORE, null, homeRestoreSaga),
    executor(HOME_AVATARS_LOAD, "", homeAvatarsLoadSaga),
];

function* homeRestoreSaga(action: HomeRestoreAction) {
    let {addonApiVersion, location, login, token, permissions, cartesIp, cartes, roots} = action.payload;
    let createdAt = now();

    addonApiVersion = addonApiVersion ?? 1;
    yield* put(browserApiSet(addonApiVersion));

    if (token) {
        yield* put(restoreConnectDialog(location, login));
        if (getCartesListTtl(cartes) < 5 * 60) {
            try {
                const data = yield* call(getCartes, normalizeUrl(location), token);
                cartesIp = data.cartesIp;
                cartes = data.cartes;
                createdAt = data.createdAt;
                Browser.storeCartesData(cartesIp, cartes);
            } catch (e) {
                yield* put(errorThrown(e));
            }
        }
        const homeLocation = yield* select(getHomeRootLocation);
        yield* put(connectedToHome(location, login, token, permissions, cartesIp, cartes, roots, createdAt - now(),
            homeLocation != null && location !== homeLocation));
    } else {
        yield* put(disconnectFromHome(location, login));
    }
}

function* homeAvatarsLoadSaga() {
    try {
        const data = yield* call(Node.getAvatars, ":");
        yield* put(homeAvatarsLoaded(data));
    } catch (e) {
        yield* put(homeAvatarsLoadFailed());
        yield* put(errorThrown(e));
    }
}
