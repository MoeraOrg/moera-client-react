import React, { useEffect, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { isAddonMessage, loadDataMessage, LoadedData, StoredName } from "api/addon/api-types";
import { PREFIX } from "api/settings";
import { ClientState } from "state/state";
import { browserApiSet, connectionsSet, disconnectedFromHome, homeOwnerSet, homeRestore } from "state/home/actions";
import { cartesSet } from "state/cartes/actions";
import { getHomeConnectionData } from "state/home/selectors";
import { namingNameLoaded, namingNamesPopulate } from "state/naming/actions";
import { isStandaloneMode } from "state/navigation/selectors";
import { settingsClientValuesSet } from "state/settings/actions";
import LocalStorageBackend from "ui/storage/LocalStorageBackend";
import { Browser } from "ui/browser";
import { now } from "util/misc";

type Props = ConnectedProps<typeof connector>;

function Storage({
    standalone, home, homeRestore, homeOwnerSet, cartesSet, browserApiSet, connectionsSet, namingNamesPopulate,
    namingNameLoaded, disconnectedFromHome, settingsClientValuesSet
}: Props) {
    const initiated = useRef<boolean>(false);

    useEffect(() => {
        window.addEventListener("message", messageReceived);
        if (standalone && !initiated.current) {
            initiated.current = true;
            Browser.postMessage(loadDataMessage());
        }
        return () => window.removeEventListener("message", messageReceived);
    });

    const loadedData = (data: LoadedData) => {
        if (!data) {
            return;
        }

        browserApiSet(data.version);
        if (data.names != null) {
            namingNamesPopulate(data.names);
        }
        if (data.roots != null) {
            connectionsSet(data.roots);
        }

        if (data.clientId === Browser.clientId) {
            return;
        }

        if (data.settings != null) {
            settingsClientValuesSet(data.settings.map(([name, value]) => ({name: PREFIX + name, value})));
        }

        const {location, nodeName, fullName = null, avatar = null, login = null, token = null,
            permissions} = data.home || {};
        if (location != null
            && (fullName != null || avatar != null || login != null || token != null || permissions != null)
            && (location !== home.location || login !== home.login || token !== home.token)) {
            homeRestore(data.version, location, login, token, permissions ?? [],
                data.cartesIp ?? null, data.cartes ?? [], data.roots ?? []);
            if (nodeName) {
                homeOwnerSet(nodeName, null, fullName, avatar);
            }
        } else {
            cartesSet(data.cartesIp ?? null, data.cartes ?? [], 0);
            if (token == null && location != null) {
                disconnectedFromHome(location, login);
            }
        }
    }

    const storedName = (data: StoredName) => namingNameLoaded(data.name, data.nodeUri, now());

    const messageReceived = (event: MessageEvent) => {
        // Only accept messages from the same frame
        if (event.source !== window) {
            return;
        }

        const message = event.data;

        // Only accept messages that we know are ours
        if (!isAddonMessage(message)) {
            return;
        }

        switch (message.action) {
            case "loadedData":
                loadedData(message.payload);
                return;

            case "storedName":
                storedName(message.payload);
                return;

            default:
                return;
        }
    };

    return standalone ? <LocalStorageBackend/> : null;
}

const connector = connect(
    (state: ClientState) => ({
        standalone: isStandaloneMode(state),
        home: getHomeConnectionData(state)
    }),
    {
        homeRestore, homeOwnerSet, cartesSet, browserApiSet, connectionsSet, namingNamesPopulate, namingNameLoaded,
        disconnectedFromHome, settingsClientValuesSet
    }
);

export default connector(Storage);
