import { call, put } from 'typed-redux-saga';
import i18n from 'i18next';

import { NodeApiError } from "api";
import { getCartes } from "api/node/cartes";
import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import { CARTES_LOAD, cartesSet, CLOCK_OFFSET_WARN } from "state/cartes/actions";
import { messageBox } from "state/messagebox/actions";
import { Browser } from "ui/browser";
import { now } from "util/misc";

export default [
    executor(CARTES_LOAD, "", cartesLoadSaga),
    executor(CLOCK_OFFSET_WARN, "", clockOffsetWarnSaga)
];

function* cartesLoadSaga() {
    try {
        const {cartesIp, cartes, createdAt} = yield* call(getCartes, ":");
        Browser.storeCartesData(cartesIp, cartes);
        yield* put(cartesSet(cartesIp, cartes, createdAt - now()));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(cartesSet(null, [], 0));
        } else {
            yield* put(errorThrown(e));
        }
    }
}

function* clockOffsetWarnSaga() {
    yield* put(messageBox(i18n.t("clock-differ")));
}
