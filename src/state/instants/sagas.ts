import { executor } from "state/executor";
import { ClientState } from "state/state";
import { barrier, dispatch, select } from "state/store-sagas";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedState, getInstantBorder } from "state/feeds/selectors";
import { instantsBorderSet } from "state/instants/actions";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("INSTANTS_MARK_VIEWED", "", instantsMarkViewedSaga)
];

const isInstantStatusLoaded = (state: ClientState) => getFeedState(state, REL_HOME, "instant").loadedStatus;

async function instantsMarkViewedSaga() {
    let loadedStatus = select(isInstantStatusLoaded);
    if (!loadedStatus) {
        await barrier("FEED_STATUS_SET", isInstantStatusLoaded, 60000);
        loadedStatus = select(isInstantStatusLoaded);
        if (!loadedStatus) {
            return;
        }
    }

    dispatch(instantsBorderSet(select(getInstantBorder)));

    const status = select(state => getFeedState(state, REL_HOME, "instant").status);
    if (status.lastMoment != null && (status.notViewed ?? 0) > 0) {
        dispatch(feedStatusUpdate(REL_HOME, "instant", true, null, status.lastMoment));
    }
}
