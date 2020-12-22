import { call, put, select } from 'redux-saga/effects';

import { Naming, NodeName } from "api";
import { getComments, getDetailedPosting } from "state/detailedposting/selectors";
import { errorThrown } from "state/error/actions";
import { getAllFeeds, getFeedState } from "state/feeds/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import {
    namingNameLoad,
    namingNameLoaded,
    namingNameLoadFailed,
    namingNamesPurge,
    namingNamesUsed
} from "state/naming/actions";
import { getNamingNameDetails, getNamingNamesToBeLoaded } from "state/naming/selectors";
import { getOwnerName } from "state/owner/selectors";
import { Browser } from "ui/browser";
import { now } from "util/misc";
import { getReactionsDialogItems } from "state/reactionsdialog/selectors";

const NAME_USAGE_UPDATE_PERIOD = 60;
const MAX_NAMES_SIZE = 500;

export function* namingNamesUsedSaga(action) {
    const {names} = action.payload;

    if (!names || names.length === 0) {
        return;
    }
    const toBeLoaded = yield select(state => getNamingNamesToBeLoaded(state, names));
    for (const name of toBeLoaded) {
        yield put(namingNameLoad(name));
    }
}

export function* namingNameLoadSaga(action) {
    yield call(fetchNodeUri, action.payload.name);
}

export function* getNodeUri(nodeName) {
    const details = yield select(state => getNamingNameDetails(state, nodeName));
    if (details.loaded) {
        if (now() - details.accessed >= NAME_USAGE_UPDATE_PERIOD) {
            Browser.storeName(nodeName, details.latest, details.nodeUri, details.updated);
            yield put(namingNamesUsed([nodeName]));
        }
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
            Browser.storeName(nodeName, latest, nodeUri, now());
        }
        yield put(namingNameLoaded(nodeName, latest, nodeUri, now()));
    } catch (e) {
        yield put(namingNameLoadFailed(nodeName));
        yield put(errorThrown(e));
    }
    return nodeUri;
}

export function* namingNamesMaintenanceSaga() {
    const used = yield call(getUsedNames);
    if (used.size > 0) {
        yield put(namingNamesUsed(Array.from(used)));
    }
    const details = yield select(state => state.naming.names);
    const names = Object.getOwnPropertyNames(details);
    if (names.length <= MAX_NAMES_SIZE) {
        return;
    }
    const unused = names.filter(name => !used.has(name));
    if (unused.length === 0) {
        return;
    }
    unused.sort((a, b) => details[a].accessed - details[b].accessed);
    const purgeSize = Math.min(unused.length, names.length - MAX_NAMES_SIZE);
    yield put(namingNamesPurge(unused.splice(0, purgeSize)));
}

function* getUsedNames() {
    let used = new Set();

    const {feedNames, postings} = yield select(state => ({
        feedNames: getAllFeeds(state),
        postings: state.postings
    }));
    for (const feedName of feedNames) {
        const stories = yield select(state => getFeedState(state, feedName).stories)
        stories.forEach(story => {
            if (story.remoteNodeName) {
                used.add(story.remoteNodeName);
            }
            const posting = postings[story.postingId];
            if (posting) {
                used.add(posting.ownerName);
                if (posting.receiverName) {
                    used.add(posting.receiverName);
                }
            }
        });
    }

    const posting = yield select(getDetailedPosting);
    if (posting != null) {
        used.add(posting.ownerName);
        if (posting.receiverName) {
            used.add(posting.receiverName);
        }
    }

    const comments = yield select(getComments);
    comments.forEach(comment => used.add(comment.ownerName));

    const reactions = yield select(getReactionsDialogItems);
    reactions.forEach(reaction => used.add(reaction.ownerName));

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
