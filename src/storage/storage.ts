import { AvatarImage, BlockedUserInfo, CarteInfo, CLIENT_SETTINGS_PREFIX } from "api";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { dispatch, select } from "state/store-sagas";
import { cartesSet } from "state/cartes/actions";
import { getCartesListTtl } from "state/cartes/selectors";
import {
    connectedToHome,
    connectionsSet,
    disconnectedFromHome,
    homeInvisibleUsersLoaded,
    homeReady
} from "state/home/actions";
import { getHomeConnectionData } from "state/home/selectors";
import { namingNamesPopulate, namingNamesSwitchServer } from "state/naming/actions";
import { boot } from "state/navigation/actions";
import { settingsClientValuesSet } from "state/settings/actions";
import { DocumentLocation } from "util/universal-url";
import * as Access from "./access"

function loadedData(data: Access.StoredData): void {
    if (!data) {
        return;
    }

    if (data.roots != null) {
        dispatch(connectionsSet(data.roots));
    }

    if (data.settings != null) {
        dispatch(settingsClientValuesSet(
            data.settings.map(([name, value]) => ({name: CLIENT_SETTINGS_PREFIX + name, value}))
        ));
    }

    if (data.names != null) {
        const serverUrl = Access.findNameServerUrl(data.settings) ?? Access.DEFAULT_NAMING_SERVER;
        dispatch(namingNamesSwitchServer(serverUrl));
        dispatch(namingNamesPopulate(serverUrl, data.names));
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
