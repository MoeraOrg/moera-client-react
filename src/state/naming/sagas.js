import { call, put, select } from 'redux-saga/effects';

import { Naming, NodeName } from "api";
import { getComments, getDetailedPosting } from "state/detailedposting/selectors";
import { errorThrown } from "state/error/actions";
import { getAllFeeds, getFeedState } from "state/feeds/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import {
    NAMING_NAME_LOAD,
    NAMING_NAMES_MAINTENANCE,
    NAMING_NAMES_USED,
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
import { askNaming } from "api/node/ask-naming";
import { executor } from "state/executor";

const NAME_USAGE_UPDATE_PERIOD = 60;
const MAX_NAMES_SIZE = 500;

export default [
    executor(NAMING_NAMES_USED, null, askNaming(namingNamesUsedSaga)),
    executor(NAMING_NAME_LOAD, payload => payload.name, askNaming(namingNameLoadSaga)),
    executor(NAMING_NAMES_MAINTENANCE, "", namingNamesMaintenanceSaga)
];

function* namingNamesUsedSaga(action) {
    const {names} = action.payload;

    if (!names || names.length === 0) {
        return;
    }
    const toBeLoaded = yield select(state => getNamingNamesToBeLoaded(state, names));
    for (const name of toBeLoaded) {
        yield put(namingNameLoad(name));
    }
}

function* namingNameLoadSaga(action) {
    yield call(fetchName, action.payload.name);
}

export function* getNodeUri(nodeName) {
    return (yield call(getNameDetails, nodeName)).nodeUri;
}

export function* getNameDetails(nodeName) {
    const details = yield select(state => getNamingNameDetails(state, nodeName));
    if (details.loaded) {
        if (now() - details.accessed >= NAME_USAGE_UPDATE_PERIOD) {
            Browser.storeName(nodeName, details.nodeUri, details.updated);
            yield put(namingNamesUsed([nodeName]));
        }
        return details;
    }
    return yield call(fetchName, nodeName);
}

function* fetchName(nodeName) {
    let nodeUri = null;
    try {
        const {name, generation} = NodeName.parse(nodeName);
        const data = yield call(Naming.getCurrent, name, generation);
        nodeUri = data ? data.nodeUri : null;
        if (data) {
            Browser.storeName(nodeName, nodeUri, now());
        }
        yield put(namingNameLoaded(nodeName, nodeUri, now()));
    } catch (e) {
        yield put(namingNameLoadFailed(nodeName));
        yield put(errorThrown(e));
    }
    return {loading: false, loaded: true, nodeUri};
}

function* namingNamesMaintenanceSaga() {
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
