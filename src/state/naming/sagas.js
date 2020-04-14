import { call, put, select } from '@redux-saga/core/effects';

import { Naming, NodeName } from "api";
import { Browser } from "api/browser";
import { errorThrown } from "state/error/actions";
import { namingNameLoad, namingNameLoaded, namingNameLoadFailed, namingNamePurge } from "state/naming/actions";
import { getDetailedPosting } from "state/detailedposting/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { getOwnerName } from "state/owner/selectors";
import { getFeedState } from "state/feeds/selectors";
import { now } from "util/misc";

export function* namingNameLoadSaga(action) {
    try {
        const {name, generation} = NodeName.parse(action.payload.name);
        const data = yield call(Naming.getCurrent, name, generation);
        const latest = !!(data && data.latest);
        const nodeUri = data ? data.nodeUri : null;
        if (data) {
            Browser.storeName(action.payload.name, latest, nodeUri);
        }
        yield put(namingNameLoaded(action.payload.name, latest, nodeUri));
    } catch (e) {
        yield put(namingNameLoadFailed(action.payload.name));
        yield put(errorThrown(e));
    }
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
