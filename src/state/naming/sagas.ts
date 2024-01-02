import { call, put, select } from 'typed-redux-saga';

import { Naming, NodeName } from "api";
import { Storage } from "storage";
import { executor } from "state/executor";
import { namingInitialized } from "state/init-selectors";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { getComments, getDetailedPosting } from "state/detailedposting/selectors";
import { getAllFeeds, getFeedState } from "state/feeds/selectors";
import { getOwnerName } from "state/node/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import {
    namingNameLoad,
    NamingNameLoadAction,
    namingNameLoaded,
    namingNameLoadFailed,
    NamingNamesMaintenanceAction,
    namingNamesPurge,
    namingNamesUsed,
    NamingNamesUsedAction
} from "state/naming/actions";
import { getNamingNameDetails, getNamingNamesToBeLoaded } from "state/naming/selectors";
import { getReactionsDialogItems } from "state/reactionsdialog/selectors";
import { now } from "util/misc";

const NAME_USAGE_UPDATE_PERIOD = 60;
const MAX_NAMES_SIZE = 500;

export default [
    executor("NAMING_NAMES_USED", null, namingNamesUsedSaga, namingInitialized),
    executor("NAMING_NAME_LOAD", payload => payload.name, namingNameLoadSaga, namingInitialized),
    executor("NAMING_NAMES_MAINTENANCE", "", namingNamesMaintenanceSaga)
];

function* namingNamesUsedSaga(action: NamingNamesUsedAction) {
    const {names} = action.payload;

    if (!names || names.length === 0) {
        return;
    }
    const toBeLoaded = yield* select(state => getNamingNamesToBeLoaded(state, names));
    for (const name of toBeLoaded) {
        yield* put(namingNameLoad(name).causedBy(action));
    }
}

function* namingNameLoadSaga(action: NamingNameLoadAction) {
    yield* call(fetchName, action, action.payload.name, false);
}

export function* getNodeUri(caller: ClientAction | null, nodeName: string) {
    return (yield* call(getNameDetails, caller, nodeName)).nodeUri;
}

export interface NameInfo {
    nodeName?: string;
    accessed: number;
    updated: number;
    loading: boolean;
    loaded: boolean;
    nodeUri: string | null;
}

export function* getNameDetails(caller: ClientAction | null, nodeName: string, includeSimilar: boolean = false) {
    const {serverUrl, details} = yield* select((state: ClientState) => ({
        serverUrl: getSetting(state, "naming.location") as string,
        details: getNamingNameDetails(state, nodeName)
    }));
    if (details.loaded) {
        if (details.nodeUri != null && now() - details.accessed >= NAME_USAGE_UPDATE_PERIOD) {
            Storage.storeName(serverUrl, nodeName, details.nodeUri, details.updated);
            yield* put(namingNamesUsed([nodeName]).causedBy(caller));
        }
        return {nodeName, ...details};
    }
    return yield* call(fetchName, caller, nodeName, includeSimilar);
}

type PromiseResolver = (value: NameInfo | PromiseLike<NameInfo>) => void;
const fetching = new Map<string, PromiseResolver[]>();

function* fetchName(caller: ClientAction | null, nodeName: string, includeSimilar: boolean) {
    if (!includeSimilar && fetching.has(nodeName)) {
        const promise = new Promise<NameInfo>(resolve => fetching.get(nodeName)!.push(resolve));
        return yield* call(() => promise);
    }

    let nodeNameFound: string = nodeName;
    let nodeUri: string | null = null;
    try {
        const {name, generation} = NodeName.parse(nodeName);
        if (name != null && generation != null) {
            if (!includeSimilar) {
                fetching.set(nodeName, []);
            }
            const current = yield* call(Naming.getCurrent, caller, name, generation);
            if (current?.nodeUri != null) {
                nodeUri = current.nodeUri;
            } else if (includeSimilar) {
                const similar = yield* call(Naming.getSimilar, caller, name);
                if (similar?.nodeUri != null) {
                    nodeNameFound = `${similar.name}_${similar.generation}`;
                    nodeUri = similar.nodeUri;
                }
            }
            if (nodeUri) {
                const serverUrl = (yield* select(state => getSetting(state, "naming.location"))) as string;
                Storage.storeName(serverUrl, nodeNameFound, nodeUri, now());
                yield* put(namingNameLoaded(nodeNameFound, nodeUri, now()).causedBy(caller));
            }
        }
    } catch (e) {
        yield* put(namingNameLoadFailed(nodeName).causedBy(caller));
    }

    const info = {nodeName: nodeNameFound, accessed: 0, updated: 0, loading: false, loaded: true, nodeUri};
    if (fetching.has(info.nodeName)) {
        fetching.get(info.nodeName)?.forEach(resolve => resolve(info));
        fetching.delete(info.nodeName);
    }
    return info;
}

function* namingNamesMaintenanceSaga(action: NamingNamesMaintenanceAction) {
    const used = yield* call(getUsedNames);
    if (used.size > 0) {
        yield* put(namingNamesUsed(Array.from(used)).causedBy(action));
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
    yield* put(namingNamesPurge(unused.splice(0, purgeSize)).causedBy(action));
}

function* getUsedNames() {
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
