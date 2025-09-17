import { executor } from "state/executor";
import { Node } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { homeIntroduced } from "state/init-barriers";
import { nodeCardsPreload } from "state/nodecards/actions";
import { ActivePeopleLoadAction, activePeopleLoaded, activePeopleLoadFailed } from "state/explore/actions";
import { getSetting } from "state/settings/selectors";
import { getSafeSearchDefault } from "state/search/selectors";
import { REL_SEARCH } from "util/rel-node-name";

export default [
    executor("ACTIVE_PEOPLE_LOAD", "", activePeopleLoadSaga),
];

async function activePeopleLoadSaga(action: WithContext<ActivePeopleLoadAction>): Promise<void> {
    await homeIntroduced();

    const sheriffNameDefault = select(state => getSetting(state, "search.sheriff-name") as string);
    const safeSearchDefault = select(getSafeSearchDefault);
    const sheriffName = safeSearchDefault && sheriffNameDefault ? sheriffNameDefault : undefined;

    try {
        const info = await Node.getRecommendedNodesByActivity(action, REL_SEARCH, sheriffName, 50);
        dispatch(activePeopleLoaded(info).causedBy(action));
        dispatch(nodeCardsPreload(info.map(n => n.nodeName)).causedBy(action));
    } catch (e) {
        dispatch(activePeopleLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}
