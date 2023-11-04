import { AvatarImage, BlockedUserInfo, CarteInfo, CLIENT_SETTINGS_PREFIX } from "api";
import store from "state/store";
import { cartesSet } from "state/cartes/actions";
import {
    connectionsSet,
    disconnectedFromHome,
    homeInitialized,
    homeInvisibleUsersLoaded,
    homeRestore
} from "state/home/actions";
import { getHomeConnectionData } from "state/home/selectors";
import { namingNamesPopulate } from "state/naming/actions";
import { settingsClientValuesSet } from "state/settings/actions";
import * as Access from "./access"

function loadedData(data: Access.StoredData) {
    if (!data) {
        return;
    }

    if (data.names != null) {
        store.dispatch(namingNamesPopulate(data.names));
    }
    if (data.roots != null) {
        store.dispatch(connectionsSet(data.roots));
    }

    if (data.settings != null) {
        store.dispatch(settingsClientValuesSet(
            data.settings.map(([name, value]) => ({name: CLIENT_SETTINGS_PREFIX + name, value}))));
    }

    if (data.invisibleUsers != null) {
        const {checksum, blockedUsers} = data.invisibleUsers;
        store.dispatch(homeInvisibleUsersLoaded(checksum, blockedUsers.map(([id, nodeName]) => ({
            id,
            blockedOperation: "visibility",
            nodeName,
            createdAt: 0
        }))));
    }

    const {
        location, nodeName, fullName = null, avatar = null, login = null, token = null, permissions
    } = data.home || {};
    const home = getHomeConnectionData(store.getState())
    if (
        location != null
            && (fullName != null || avatar != null || login != null || token != null || permissions != null)
            && (location !== home.location || login !== home.login || token !== home.token)
    ) {
        store.dispatch(homeRestore({
            location,
            login,
            token,
            name: nodeName ?? null,
            fullName,
            avatar,
            permissions: permissions ?? [],
            cartesIp: data.cartesIp ?? null,
            cartes: data.cartes ?? [],
            roots: data.roots ?? []
        }));
    } else {
        store.dispatch(cartesSet(data.cartesIp ?? null, data.cartes ?? [], 0));
        if (token == null && location != null) {
            store.dispatch(disconnectedFromHome(location, login));
        }
    }
}

export function loadData(): void {
    loadedData(Access.loadData());
    store.dispatch(homeInitialized());
}

export function storeConnectionData(location: string, nodeName: string | null, fullName: string | null,
    avatar: AvatarImage | null, login: string | null, token: string | null,
    permissions: string[] | null): void {
    if (window.Android) {
        window.Android.connectedToHome(location + "/moera", token, nodeName);
    }
    Access.storeData({home: {location, nodeName, fullName, avatar, login, token, permissions}});
}

export function storeCartesData(cartesIp: string | null, cartes: CarteInfo[] | null): void {
    Access.storeData({cartesIp, cartes});
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

export function deleteData(location: string): void {
    loadedData(Access.deleteData(location));
}

export function switchData(location: string): void {
    loadedData(Access.switchData(location))
}

export function storeName(name: string, nodeUri: string, updated: number) {
    Access.storeName(name, nodeUri, updated);
}
