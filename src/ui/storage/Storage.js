import React from 'react';
import { connect } from 'react-redux';

import { browserApiSet, connectionsSet, disconnectFromHome, homeOwnerSet, homeRestore } from "state/home/actions";
import { cartesSet } from "state/cartes/actions";
import { getHomeConnectionData } from "state/home/selectors";
import { namingNameLoaded, namingNamesPopulate } from "state/naming/actions";
import { isStandaloneMode } from "state/navigation/selectors";
import LocalStorageBackend from "ui/storage/LocalStorageBackend";
import { Browser } from "ui/browser";
import { webPushInvitationRestore, webPushSubscriptionSet } from "state/webpush/actions";

class Storage extends React.PureComponent {

    componentDidMount() {
        window.addEventListener("message", this.messageReceived);
        if (this.props.standalone) {
            window.postMessage({
                source: "moera",
                action: "loadData",
            }, window.location.href);
        }
    }

    messageReceived = event => {
        // Only accept messages from the same frame
        if (event.source !== window) {
            return;
        }

        const message = event.data;

        // Only accept messages that we know are ours
        if (message === null || typeof message !== "object" || message.source !== "moera") {
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

    loadedData(data) {
        const {
            home, homeRestore, homeOwnerSet, cartesSet, browserApiSet, connectionsSet, namingNamesPopulate,
            webPushSubscriptionSet, webPushInvitationRestore, disconnectFromHome
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

        const webPush = data.webPush || {};
        webPushSubscriptionSet(webPush.subscriptionId || null);
        webPushInvitationRestore(webPush.invitationStage || 0, webPush.invitationTimestamp || 0);

        if (data.clientId === Browser.clientId) {
            return;
        }

        const {location, nodeName, login, token, permissions} = data.home || {};
        if ((location != null || login != null || token != null || permissions != null)
                && (location !== home.location || login !== home.login || token !== home.token)) {
            homeRestore(data.version, location, login, token, permissions, data.cartesIp, data.cartes, data.roots);
            if (nodeName) {
                homeOwnerSet(nodeName, null);
            }
        } else {
            cartesSet(data.cartesIp, data.cartes);
            disconnectFromHome(location, login);
        }
    }

    storedName(data) {
        this.props.namingNameLoaded(data.name, data.latest, data.nodeUri);
    }

    render() {
        return this.props.standalone ? <LocalStorageBackend/> : null;
    }

}

export default connect(
    state => ({
        standalone: isStandaloneMode(state),
        home: getHomeConnectionData(state)
    }),
    {
        homeRestore, homeOwnerSet, cartesSet, browserApiSet, connectionsSet, namingNamesPopulate, namingNameLoaded,
        webPushSubscriptionSet, webPushInvitationRestore, disconnectFromHome
    }
)(Storage);
