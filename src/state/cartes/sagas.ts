import { call, put } from 'typed-redux-saga';
import i18n from 'i18next';

import { NodeApiError, Node } from "api";
import { Storage } from "storage";
import { executor } from "state/executor";
import { errorThrown } from "state/error/actions";
import { CARTES_LOAD, cartesLoaded, cartesSet, CLOCK_OFFSET_WARN } from "state/cartes/actions";
import { messageBox } from "state/messagebox/actions";
import { now } from "util/misc";

export default [
    executor(CARTES_LOAD, "", cartesLoadSaga),
    executor(CLOCK_OFFSET_WARN, "", clockOffsetWarnSaga)
];

function* cartesLoadSaga() {
    try {
        const {cartesIp, cartes, createdAt} = yield* call(Node.getCartes, ":", null, ["node-name-not-set"]);
        Storage.storeCartesData(cartesIp ?? null, cartes);
        yield* put(cartesSet(cartesIp ?? null, cartes, createdAt - now()));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(cartesSet(null, [], 0));
        } else {
            yield* put(errorThrown(e));
        }
    }
    yield* put(cartesLoaded());
}

function* clockOffsetWarnSaga() {
    yield* put(messageBox(i18n.t("clock-differ")));
}
