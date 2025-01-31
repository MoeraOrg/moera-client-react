import i18n from 'i18next';

import { CarteAttributes, Node, NodeApiError } from "api";
import { Storage } from "storage";
import { executor } from "state/executor";
import { CartesLoadAction, cartesLoaded, cartesSet, ClockOffsetWarnAction } from "state/cartes/actions";
import { WithContext } from "state/action-types";
import { messageBox } from "state/messagebox/actions";
import { REL_HOME } from "util/rel-node-name";
import { now } from "util/misc";
import { dispatch } from "state/store-sagas";

export default [
    executor("CARTES_LOAD", "", cartesLoadSaga),
    executor("CLOCK_OFFSET_WARN", "", clockOffsetWarnSaga)
];

async function cartesLoadSaga(action: WithContext<CartesLoadAction>): Promise<void> {
    try {
        let attrs: CarteAttributes = {clientScope: ["all"]};
        const {cartesIp, cartes: allCartes, createdAt} =
            await Node.createCartes(action, REL_HOME, attrs, ["node-name-not-set"]);
        dispatch(cartesSet(cartesIp ?? null, allCartes, createdAt - now()).causedBy(action));

        attrs = {clientScope: ["view-media"]};
        const {cartes: viewMediaCartes} = await Node.createCartes(action, REL_HOME, attrs, ["node-name-not-set"]);
        const cartes = allCartes.concat(viewMediaCartes);
        Storage.storeCartesData(cartesIp ?? null, cartes);
        dispatch(cartesSet(cartesIp ?? null, cartes, createdAt - now()).causedBy(action));
    } catch (e) {
        if (e instanceof NodeApiError) {
            dispatch(cartesSet(null, [], 0).causedBy(action));
        }
    }
    dispatch(cartesLoaded().causedBy(action));
}

function clockOffsetWarnSaga(action: ClockOffsetWarnAction): void {
    dispatch(messageBox(i18n.t("clock-differ")).causedBy(action));
}
