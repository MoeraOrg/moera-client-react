import i18n from 'i18next';

import { Node, NodeApiError } from "api";
import { Storage } from "storage";
import { saga } from "state/saga";
import { CartesLoadAction, cartesLoaded, cartesSet, ClockOffsetWarnAction } from "state/cartes/actions";
import { WithContext } from "state/action-types";
import { getHomeRootLocation } from "state/home/selectors";
import { messageBox } from "state/messagebox/actions";
import { dispatch, select } from "state/store-sagas";
import { REL_HOME } from "util/rel-node-name";
import { now } from "util/misc";

export default [
    saga("CARTES_LOAD", "", cartesLoadSaga),
    saga("CLOCK_OFFSET_WARN", "", clockOffsetWarnSaga)
];

async function cartesLoadSaga(action: WithContext<CartesLoadAction>): Promise<void> {
    try {
        do {
            const homeLocation = select(getHomeRootLocation);
            try {
                const {cartesIp, cartes, createdAt} = await Node.createCartes(
                    action, REL_HOME, {clientScope: ["all"]}, ["node-name-not-set"]
                );
                if (select(getHomeRootLocation) === homeLocation) {
                    Storage.storeCartesData(homeLocation, cartesIp ?? null, cartes);
                    dispatch(cartesSet(cartesIp ?? null, cartes, createdAt - now()).causedBy(action));
                    break;
                }
            } catch (e) {
                if (select(getHomeRootLocation) === homeLocation) {
                    if (e instanceof NodeApiError) {
                        dispatch(cartesSet(null, [], 0).causedBy(action));
                    }
                    break;
                }
            }
        } while (true);
    } finally {
        dispatch(cartesLoaded().causedBy(action));
    }
}

function clockOffsetWarnSaga(action: ClockOffsetWarnAction): void {
    dispatch(messageBox(i18n.t("clock-differ")).causedBy(action));
}
