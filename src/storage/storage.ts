import * as immutable from 'object-path-immutable';

import { AvatarImage, BlockedUserInfo, CarteInfo, CLIENT_SETTINGS_PREFIX, Features } from "api";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { dispatch, select } from "state/store-sagas";
import { cartesSet } from "state/cartes/actions";
import { getCartesListTtl } from "state/cartes/selectors";
import {
    anonymousFullNameSet,
    connectedToHome,
    connectionsSet,
    disconnectedFromHome,
    homeInvisibleUsersLoaded,
    homeReady
} from "state/home/actions";
import { getHomeConnectionData } from "state/home/selectors";
import { namingNamesPopulate, namingNamesSwitchServer } from "state/naming/actions";
import { boot } from "state/navigation/actions";
import { nodeFeaturesLoaded } from "state/node/actions";
import { remoteMediaMaintenance, remoteMediaPopulate } from "state/remotemedia/actions";
import { RemoteMediaState } from "state/remotemedia/state";
import { settingsClientValuesLoaded } from "state/settings/actions";
import { DocumentLocation } from "util/universal-url";
import { RemoteMediaData } from "./data";
import * as Access from "./access";

function loadedData(data: Access.StoredData): void {
    if (!data) {
        return;
    }

    if (data.roots != null) {
        dispatch(connectionsSet(data.roots));
    }

    if (data.settings != null) {
        dispatch(settingsClientValuesLoaded(
            data.settings.map(([name, value]) => ({name: CLIENT_SETTINGS_PREFIX + name, value})),
            true
        ));
    }

    if (data.names != null) {
        const serverUrl = Access.findNameServerUrl(data.settings) ?? Access.DEFAULT_NAMING_SERVER;
        dispatch(namingNamesSwitchServer(serverUrl));
        dispatch(namingNamesPopulate(serverUrl, data.names));
    }

    if (data.remoteMedia != null) {
        dispatch(remoteMediaPopulate(data.remoteMedia));
        dispatch(remoteMediaMaintenance());
    }

    if (data.invisibleUsers != null) {
        const {checksum, blockedUsers} = data.invisibleUsers;
        dispatch(homeInvisibleUsersLoaded(checksum, blockedUsers.map(([id, nodeName]) => ({
            id,
            blockedOperation: "visibility",
            nodeName,
            createdAt: 0
        }))));
    }

    if (getCartesListTtl(data.cartes) < 5 * 60) {
        data.cartesIp = null;
        data.cartes = [];
    }

    if (data.anonymousFullName) {
        dispatch(anonymousFullNameSet(data.anonymousFullName ?? null));
    }

    const {
        location, nodeName, fullName = null, avatar = null, login = null, token = null, permissions
    } = data.home || {};
    const home = select(getHomeConnectionData);
    if (location != null && token != null) {
        if (location !== home.location || login !== home.login || token !== home.token) {
            dispatch(connectedToHome({
                location,
                login,
                token,
                permissions: permissions ?? [],
                name: nodeName,
                fullName,
                avatar,
                cartesIp: data.cartesIp,
                cartes: data.cartes ?? [],
                roots: data.roots ?? []
            }));
        }
    } else {
        dispatch(cartesSet(data.cartesIp ?? null, data.cartes ?? [], 0));
        if (location != null && token == null) {
            dispatch(disconnectedFromHome());
        }
    }

    if (nodeName != null && data.features != null) {
        dispatch(nodeFeaturesLoaded(nodeName, data.features, true));
    }
}

export function loadData(): void {
    const data = Access.loadData();
    loadedData(data);
    if (data.home?.location == null) {
        dispatch(homeReady());
    }
}

export function storeConnectionData(location: string, nodeName: string | null, fullName: string | null,
    avatar: AvatarImage | null, login: string | null, token: string | null, permissions: string[] | null
): void {
    window.Android?.connectedToHome(location + "/moera", token, nodeName);
    const roots = Access.storeData({home: {location, nodeName, fullName, avatar, login, token, permissions}});
    dispatch(connectionsSet(roots));
}

export function storeCartesData(
    rootLocation: string | null, cartesIp: string | null, cartes: CarteInfo[] | null
): void {
    if (rootLocation == null) {
        return;
    }
    Access.storeDataForRoot(rootLocation, {cartesIp, cartes});
}

export function storeSettings(settings: Map<string, string | null>): void {
    const data: [string, string | null][] = [];
    settings.forEach((value, name) => data.push([name.substring(CLIENT_SETTINGS_PREFIX.length), value]));
    Access.storeData({settings: data});
}

export function storeInvisibleUsers(checksum: number, blockedUsers: BlockedUserInfo[]): void {
    Access.storeData({
        invisibleUsers: {
            checksum,
            blockedUsers: blockedUsers.map(bu => [bu.id, bu.nodeName])
        }
    });
}

export function storeFeatures(features: Features): void {
    Access.storeData({features});
}

export function deleteData(location: string): void {
    const reboot = Access.deleteData(location);
    if (reboot) {
        dispatch(boot());
    }
}

export function switchData(location: string, target?: DocumentLocation, initialState?: Partial<ClientState>): void {
    const reboot = Access.switchData(location);
    if (reboot) {
        dispatch(boot(target, initialState));
    }
}

export function storeName(serverUrl: string, name: string, nodeUri: string, updated: number) {
    Access.storeName(serverUrl, name, nodeUri, updated);
}

export function reloadNames(cause: ClientAction | null, serverUrl: string) {
    const names = Access.loadNames(serverUrl);
    dispatch(namingNamesSwitchServer(serverUrl).causedBy(cause));
    dispatch(namingNamesPopulate(serverUrl, names).causedBy(cause));
}

function buildRemoteMediaData(remoteMedia: RemoteMediaState): RemoteMediaData {
    let data: RemoteMediaData = {};
    for (const [nodeName, node] of Object.entries(remoteMedia)) {
        if (node == null) {
            continue;
        }
        for (const [mediaId, status] of Object.entries(node)) {
            if (status?.loaded && !status.error && status.media != null) {
                data = immutable.set(data, [nodeName, mediaId], status.media);
            }
        }
    }
    return data;
}

export function storeRemoteMedia(remoteMedia: RemoteMediaState): void {
    Access.storeRemoteMedia(buildRemoteMediaData(remoteMedia));
}

export function storeAnonymousFullName(anonymousFullName: string | null): void {
    Access.storeAnonymousFullName(anonymousFullName);
}
