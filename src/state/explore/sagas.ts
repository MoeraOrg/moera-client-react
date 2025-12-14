import { executor } from "state/executor";
import { Node } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { homeIntroduced } from "state/init-barriers";
import { nodeCardsPreload } from "state/nodecards/actions";
import {
    ActivePeopleLoadAction,
    activePeopleLoaded,
    activePeopleLoadFailed,
    TrendingLoadAction,
    trendingLoaded,
    trendingLoadFailed,
    DiscussionsLoadAction,
    discussionsLoaded,
    discussionsLoadFailed
} from "state/explore/actions";
import { getSetting } from "state/settings/selectors";
import { getSafeSearchDefault } from "state/search/selectors";
import { REL_SEARCH } from "util/rel-node-name";

export default [
    executor("ACTIVE_PEOPLE_LOAD", "", activePeopleLoadSaga),
    executor("TRENDING_LOAD", "", trendingLoadSaga),
    executor("DISCUSSIONS_LOAD", "", discussionsLoadSaga),
];

function getSheriffName(): string | undefined {
    const sheriffNameDefault = select(state => getSetting(state, "search.sheriff-name") as string);
    const safeSearchDefault = select(getSafeSearchDefault);
    return safeSearchDefault && sheriffNameDefault ? sheriffNameDefault : undefined;
}

async function activePeopleLoadSaga(action: WithContext<ActivePeopleLoadAction>): Promise<void> {
    await homeIntroduced();

    try {
        const info = await Node.getRecommendedNodesByActivity(action, REL_SEARCH, getSheriffName(), 50);
        dispatch(activePeopleLoaded(info).causedBy(action));
        dispatch(nodeCardsPreload(info.map(n => n.nodeName)).causedBy(action));
    } catch (e) {
        dispatch(activePeopleLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function trendingLoadSaga(action: WithContext<TrendingLoadAction>): Promise<void> {
    await homeIntroduced();

    try {
        const info = await Node.getRecommendedPostingsForReading(action, REL_SEARCH, getSheriffName(), 15);
        dispatch(trendingLoaded(info).causedBy(action));
    } catch (e) {
        dispatch(trendingLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function discussionsLoadSaga(action: WithContext<DiscussionsLoadAction>): Promise<void> {
    await homeIntroduced();

    try {
        const info = await Node.getRecommendedPostingsForCommenting(action, REL_SEARCH, getSheriffName(), 15);
        dispatch(discussionsLoaded(info).causedBy(action));
    } catch (e) {
        dispatch(discussionsLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}
