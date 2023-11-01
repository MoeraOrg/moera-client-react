import { call, put, select } from 'typed-redux-saga';
import { CallEffect, PutEffect, SelectEffect } from 'redux-saga/effects';

import { Naming, NodeName } from "api";
import { Storage } from "storage";
import { getComments, getDetailedPosting } from "state/detailedposting/selectors";
import { getAllFeeds, getFeedState } from "state/feeds/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import {
    NAMING_NAME_LOAD,
    NAMING_NAMES_MAINTENANCE,
    NAMING_NAMES_USED,
    namingNameLoad,
    NamingNameLoadAction,
    namingNameLoaded,
    namingNameLoadFailed,
    namingNamesPurge,
    namingNamesUsed,
    NamingNamesUsedAction
} from "state/naming/actions";
import { getNamingNameDetails, getNamingNamesToBeLoaded } from "state/naming/selectors";
import { getOwnerName } from "state/node/selectors";
import { getReactionsDialogItems } from "state/reactionsdialog/selectors";
import { executor } from "state/executor";
import { ClientState } from "state/state";
import { namingInitialized } from "state/init-selectors";
import { now } from "util/misc";

const NAME_USAGE_UPDATE_PERIOD = 60;
const MAX_NAMES_SIZE = 500;

export default [
    executor(NAMING_NAMES_USED, null, namingNamesUsedSaga, namingInitialized),
    executor(NAMING_NAME_LOAD, payload => payload.name, namingNameLoadSaga, namingInitialized),
    executor(NAMING_NAMES_MAINTENANCE, "", namingNamesMaintenanceSaga)
];

function* namingNamesUsedSaga(action: NamingNamesUsedAction) {
    const {names} = action.payload;

    if (!names || names.length === 0) {
        return;
    }
    const toBeLoaded = yield* select(state => getNamingNamesToBeLoaded(state, names));
    for (const name of toBeLoaded) {
        yield* put(namingNameLoad(name));
    }
}

function* namingNameLoadSaga(action: NamingNameLoadAction) {
    yield* call(fetchName, action.payload.name, false);
}

export function* getNodeUri(nodeName: string): Generator<CallEffect, string | null> {
    return (yield* call(getNameDetails, nodeName)).nodeUri;
}

export interface NameInfo {
    nodeName?: string;
    accessed: number;
    updated: number;
    loading: boolean;
    loaded: boolean;
    nodeUri: string | null;
}

type NameInfoGenerator = Generator<CallEffect | PutEffect | SelectEffect, NameInfo>;

export function* getNameDetails(nodeName: string, includeSimilar: boolean = false): NameInfoGenerator {
    const details = yield* select(state => getNamingNameDetails(state, nodeName));
    if (details.loaded) {
        if (details.nodeUri != null && now() - details.accessed >= NAME_USAGE_UPDATE_PERIOD) {
            Storage.storeName(nodeName, details.nodeUri, details.updated);
            yield* put(namingNamesUsed([nodeName]));
        }
        return details;
    }
    return yield* call(fetchName, nodeName, includeSimilar);
}

function* fetchName(nodeName: string, includeSimilar: boolean): NameInfoGenerator {
    let nodeNameFound: string = nodeName;
    let nodeUri: string | null = null;
    try {
        const {name, generation} = NodeName.parse(nodeName);
        if (name != null && generation != null) {
            const current = yield* call(Naming.getCurrent, name, generation);
            if (current?.nodeUri != null) {
                nodeUri = current.nodeUri;
            } else if (includeSimilar) {
                const similar = yield* Naming.getSimilar(name);
                if (similar?.nodeUri != null) {
                    nodeNameFound = similar.name;
                    nodeUri = similar.nodeUri;
                }
            }
            if (nodeUri) {
                Storage.storeName(nodeNameFound, nodeUri, now());
                yield* put(namingNameLoaded(nodeNameFound, nodeUri, now()));
            }
        }
    } catch (e) {
        yield* put(namingNameLoadFailed(nodeName));
    }
    return {nodeName: nodeNameFound, accessed: 0, updated: 0, loading: false, loaded: true, nodeUri};
}

function* namingNamesMaintenanceSaga() {
    const used = yield* call(getUsedNames);
    if (used.size > 0) {
        yield* put(namingNamesUsed(Array.from(used)));
    }
    const details = yield* select(state => state.naming.names);
    const names = Object.keys(details);
    if (names.length <= MAX_NAMES_SIZE) {
        return;
    }
    const unused = names.filter(name => !used.has(name));
    if (unused.length === 0) {
        return;
    }
    unused.sort((a, b) => details[a].accessed - details[b].accessed);
    const purgeSize = Math.min(unused.length, names.length - MAX_NAMES_SIZE);
    yield* put(namingNamesPurge(unused.splice(0, purgeSize)));
}

function* getUsedNames(): Generator<SelectEffect, Set<string>> {
    let used = new Set<string>();

    const {feedNames, postings} = yield* select((state: ClientState) => ({
        feedNames: getAllFeeds(state),
        postings: state.postings[""] ?? {}
    }));
    for (const feedName of feedNames) {
        const stories = yield* select(state => getFeedState(state, feedName).stories)
        stories.forEach(story => {
            if (story.remoteNodeName) {
                used.add(story.remoteNodeName);
            }
            const posting = story.postingId != null ? postings[story.postingId] : null;
            if (posting) {
                used.add(posting.posting.ownerName);
                if (posting.posting.receiverName) {
                    used.add(posting.posting.receiverName);
                }
            }
        });
    }

    const posting = yield* select(getDetailedPosting);
    if (posting != null) {
        used.add(posting.ownerName);
        if (posting.receiverName) {
            used.add(posting.receiverName);
        }
    }

    const comments = yield* select(getComments);
    comments.forEach(comment => used.add(comment.ownerName));

    const reactions = yield* select(getReactionsDialogItems);
    reactions.forEach(reaction => used.add(reaction.ownerName!));

    let name = yield* select(getHomeOwnerName);
    if (name) {
        used.add(name);
    }

    name = yield* select(getOwnerName);
    if (name != null) {
        used.add(name);
    }

    return used;
}
