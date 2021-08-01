import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { browserApiSet, connectionsSet, disconnectedFromHome, homeOwnerSet, homeRestore } from "state/home/actions";
import { cartesSet } from "state/cartes/actions";
import { getHomeConnectionData } from "state/home/selectors";
import { namingNameLoaded, namingNamesPopulate } from "state/naming/actions";
import { isStandaloneMode } from "state/navigation/selectors";
import LocalStorageBackend from "ui/storage/LocalStorageBackend";
import { Browser } from "ui/browser";
import { isAddonMessage, loadDataMessage, LoadedData, StoredName } from "ui/storage/types";
import { now } from "util/misc";

type Props = ConnectedProps<typeof connector>;

class Storage extends React.PureComponent<Props> {

    componentDidMount() {
        window.addEventListener("message", this.messageReceived);
        if (this.props.standalone) {
            Browser.postMessage(loadDataMessage());
        }
    }

    messageReceived = (event: MessageEvent) => {
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
                this.loadedData(message.payload);
                return;

            case "storedName":
                this.storedName(message.payload);
                return;

            default:
                return;
        }
    };

    loadedData(data: LoadedData) {
        const {
            home, homeRestore, homeOwnerSet, cartesSet, browserApiSet, connectionsSet, namingNamesPopulate,
            disconnectedFromHome
        } = this.props;

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

    storedName(data: StoredName) {
        this.props.namingNameLoaded(data.name, data.nodeUri, now());
    }

    render() {
        return this.props.standalone ? <LocalStorageBackend/> : null;
    }

}

const connector = connect(
    (state: ClientState) => ({
        standalone: isStandaloneMode(state),
        home: getHomeConnectionData(state)
    }),
    {
        homeRestore, homeOwnerSet, cartesSet, browserApiSet, connectionsSet, namingNamesPopulate, namingNameLoaded,
        disconnectedFromHome
    }
);

export default connector(Storage);
