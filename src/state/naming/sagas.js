import { call, put, select } from '@redux-saga/core/effects';

import { Naming, NodeName } from "api";
import { getDetailedPosting } from "state/detailedposting/selectors";
import { errorThrown } from "state/error/actions";
import { getFeedState } from "state/feeds/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { namingNameLoad, namingNameLoaded, namingNameLoadFailed, namingNamePurge } from "state/naming/actions";
import { getNamingNameDetails } from "state/naming/selectors";
import { getOwnerName } from "state/owner/selectors";
import { Browser } from "ui/browser";
import { now } from "util/misc";

export function* namingNameLoadSaga(action) {
    yield call(fetchNodeUri, action.payload.name);
}

export function* getNodeUri(nodeName) {
    const details = yield select(state => getNamingNameDetails(state, nodeName));
    if (details.loaded) {
        return details.nodeUri;
    }
    return yield call(fetchNodeUri, nodeName);
}

function* fetchNodeUri(nodeName) {
    let nodeUri = null;
    try {
        const {name, generation} = NodeName.parse(nodeName);
        const data = yield call(Naming.getCurrent, name, generation);
        const latest = !!(data && data.latest);
        nodeUri = data ? data.nodeUri : null;
        if (data) {
            Browser.storeName(nodeName, latest, nodeUri);
        }
        yield put(namingNameLoaded(nodeName, latest, nodeUri));
    } catch (e) {
        yield put(namingNameLoadFailed(nodeName));
        yield put(errorThrown(e));
    }
    return nodeUri;
}

const USED_NAME_RELOAD_PERIOD = 6 * 60 * 60;
const UNUSED_NAME_TTL = 30 * 60;

export function* namingNamesMaintenanceSaga() {
    const used = yield call(getUsedNames);
    const names = yield select(state => state.naming.names);
    const usedNameDeadline = now() - USED_NAME_RELOAD_PERIOD;
    const unusedNameDeadline = now() - UNUSED_NAME_TTL;
    for (let [name, details] of Object.entries(names)) {
        if (used.has(name)) {
            if (details.accessed < usedNameDeadline) {
                yield put(namingNameLoad(name));
            }
        } else {
            if (details.accessed < unusedNameDeadline) {
                yield put(namingNamePurge(name));
            }
        }
    }
}

function* getUsedNames() {
    let used = new Set();
    const {timeline, postings} = yield select(state => ({
        timeline: getFeedState(state, "timeline").stories,
        postings: state.postings
    }));
    timeline.forEach(t => {
        const posting = postings[t.postingId];
        used.add(posting.ownerName);
        used.add(posting.receiverName);
    });
    const posting = yield select(getDetailedPosting);
    if (posting != null) {
        used.add(posting.ownerName);
        used.add(posting.receiverName);
    }
    let name = yield select(getHomeOwnerName);
    if (name) {
        used.add(name);
    }
    name = yield select(getOwnerName);
    if (name != null) {
        used.add(name);
    }

    return used;
}
