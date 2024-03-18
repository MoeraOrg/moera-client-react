import { call, put } from 'typed-redux-saga';
import i18n from 'i18next';

import { Node, NodeApiError } from "api";
import { Storage } from "storage";
import { executor } from "state/executor";
import { CartesLoadAction, cartesLoaded, cartesSet, ClockOffsetWarnAction } from "state/cartes/actions";
import { WithContext } from "state/action-types";
import { messageBox } from "state/messagebox/actions";
import { REL_HOME } from "util/rel-node-name";
import { now } from "util/misc";

export default [
    executor("CARTES_LOAD", "", cartesLoadSaga),
    executor("CLOCK_OFFSET_WARN", "", clockOffsetWarnSaga)
];

function* cartesLoadSaga(action: WithContext<CartesLoadAction>) {
    try {
        const {cartesIp, cartes, createdAt} = yield* call(Node.getCartes, action, REL_HOME, null, ["node-name-not-set"]);
        Storage.storeCartesData(cartesIp ?? null, cartes);
        yield* put(cartesSet(cartesIp ?? null, cartes, createdAt - now()).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield* put(cartesSet(null, [], 0).causedBy(action));
        }
    }
    yield* put(cartesLoaded().causedBy(action));
}

function* clockOffsetWarnSaga(action: ClockOffsetWarnAction) {
    yield* put(messageBox(i18n.t("clock-differ")).causedBy(action));
}
