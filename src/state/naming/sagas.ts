import { Naming, NodeName, RegisteredName } from "api";
import { Storage } from "storage";
import { executor } from "state/executor";
import { namingInitialized } from "state/init-barriers";
import { ClientAction } from "state/action";
import { dispatch, select } from "state/store-sagas";
import { getComments, getDetailedPosting } from "state/detailedposting/selectors";
import { getAllFeeds, getFeedState } from "state/feeds/selectors";
import { getOwnerName, getOwnerNameOrUrl } from "state/node/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import {
    namingNameLoad,
    NamingNameLoadAction,
    namingNameLoaded,
    namingNameLoadFailed,
    NamingNamesMaintenanceAction,
    namingNamesPurge,
    NamingNamesReloadAction,
    namingNamesUsed,
    NamingNamesUsedAction
} from "state/naming/actions";
import { getNamingNameDetails, getNamingNamesToBeLoaded } from "state/naming/selectors";
import { getReactionsDialogItems } from "state/reactionsdialog/selectors";
import { now, PromiseResolver } from "util/misc";

const NAME_USAGE_UPDATE_PERIOD = 60;
const MAX_NAMES_SIZE = 500;

export default [
    executor("NAMING_NAMES_USED", null, namingNamesUsedSaga),
    executor("NAMING_NAME_LOAD", payload => payload.name, namingNameLoadSaga),
    executor("NAMING_NAMES_MAINTENANCE", "", namingNamesMaintenanceSaga),
    executor("NAMING_NAMES_RELOAD", "", namingNamesReloadSaga)
];

async function namingNamesUsedSaga(action: NamingNamesUsedAction): Promise<void> {
    await namingInitialized();
    const {names} = action.payload;

    if (!names || names.length === 0) {
        return;
    }
    const toBeLoaded = select(state => getNamingNamesToBeLoaded(state, names));
    for (const name of toBeLoaded) {
        dispatch(namingNameLoad(name).causedBy(action));
    }
}

async function namingNameLoadSaga(action: NamingNameLoadAction): Promise<void> {
    await namingInitialized();
    await fetchName(action, action.payload.name, false);
}

export async function getNodeUri(caller: ClientAction | null, nodeName: string): Promise<string | null> {
    return (await getNameDetails(caller, nodeName)).nodeUri;
}

export interface NameInfo {
    nodeName?: string;
    accessed: number;
    updated: number;
    loading: boolean;
    loaded: boolean;
    nodeUri: string | null;
}

export async function getNameDetails(
    caller: ClientAction | null, nodeName: string, includeSimilar: boolean = false
): Promise<NameInfo> {
    const {serverUrl, details} = select(state => ({
        serverUrl: getSetting(state, "naming.location") as string,
        details: getNamingNameDetails(state, nodeName)
    }));
    if (details.loaded) {
        if (details.nodeUri != null && now() - details.accessed >= NAME_USAGE_UPDATE_PERIOD) {
            Storage.storeName(serverUrl, nodeName, details.nodeUri, details.updated);
            dispatch(namingNamesUsed([nodeName]).causedBy(caller));
        }
        return {nodeName, ...details};
    }
    return fetchName(caller, nodeName, includeSimilar);
}

const fetching = new Map<string, PromiseResolver<NameInfo>[]>();

async function fetchName(caller: ClientAction | null, nodeName: string, includeSimilar: boolean): Promise<NameInfo> {
    nodeName = NodeName.expand(nodeName);
    if (!includeSimilar && fetching.has(nodeName)) {
        return new Promise<NameInfo>(resolve => fetching.get(nodeName)!.push(resolve));
    }

    let nodeNameFound: string = nodeName;
    let nodeUri: string | null = null;
    try {
        const {name, generation} = NodeName.parse(nodeName);
        if (name != null && generation != null) {
            if (!includeSimilar) {
                fetching.set(nodeName, []);
            }
            const current = await Naming.getCurrent(caller, name, generation);
            if (current?.nodeUri != null) {
                nodeNameFound = new RegisteredName(current.name, current.generation).format();
                nodeUri = current.nodeUri;
            } else if (includeSimilar) {
                const similar = await Naming.getSimilar(caller, name);
                if (similar?.nodeUri != null) {
                    nodeNameFound = new RegisteredName(similar.name, similar.generation).format();
                    nodeUri = similar.nodeUri;
                }
            }
            if (nodeUri) {
                const serverUrl = select(state => getSetting(state, "naming.location")) as string;
                Storage.storeName(serverUrl, nodeNameFound, nodeUri, now());
                dispatch(namingNameLoaded(serverUrl, nodeNameFound, nodeUri, now()).causedBy(caller));
            }
        }
    } catch (e) {
        dispatch(namingNameLoadFailed(nodeName).causedBy(caller));
    }

    const info = {nodeName: nodeNameFound, accessed: 0, updated: 0, loading: false, loaded: true, nodeUri};
    if (fetching.has(info.nodeName)) {
        const promises = fetching.get(info.nodeName);
        fetching.delete(info.nodeName);
        promises?.forEach(resolve => resolve(info));
    }
    return info;
}

function namingNamesMaintenanceSaga(action: NamingNamesMaintenanceAction): void {
    const used = getUsedNames();
    if (used.size > 0) {
        dispatch(namingNamesUsed(Array.from(used)).causedBy(action));
    }
    const details = select(state => state.naming.names);
    const names = Object.keys(details);
    if (names.length <= MAX_NAMES_SIZE) {
        return;
    }
    const unused = names.filter(name => !used.has(name));
    if (unused.length === 0) {
        return;
    }
    unused.sort((a, b) => details[a]!.accessed - details[b]!.accessed);
    const purgeSize = Math.min(unused.length, names.length - MAX_NAMES_SIZE);
    dispatch(namingNamesPurge(unused.splice(0, purgeSize)).causedBy(action));
}

function getUsedNames(): Set<string> {
    let used = new Set<string>();

    const {feeds, postings} = select(state => ({
        feeds: getAllFeeds(state),
        postings: state.postings[getOwnerNameOrUrl(state)] ?? {}
    }));
    for (const {nodeName, feedName} of feeds) {
        const stories = select(state => getFeedState(state, nodeName, feedName).stories)
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

    const posting = select(getDetailedPosting);
    if (posting != null) {
        used.add(posting.ownerName);
        if (posting.receiverName) {
            used.add(posting.receiverName);
        }
    }

    const comments = select(getComments);
    comments.forEach(comment => used.add(comment.ownerName));

    const reactions = select(getReactionsDialogItems);
    reactions.forEach(reaction => used.add(reaction.ownerName!));

    let name = select(getHomeOwnerName);
    if (name) {
        used.add(name);
    }

    name = select(getOwnerName);
    if (name != null) {
        used.add(name);
    }

    return used;
}

function namingNamesReloadSaga(action: NamingNamesReloadAction): void {
    const {namingLocation, serverUrl} = select(state => ({
        namingLocation: getSetting(state, "naming.location") as string,
        serverUrl: state.naming.serverUrl
    }));
    if (namingLocation !== serverUrl) {
        Storage.reloadNames(action, namingLocation);
    }
}
