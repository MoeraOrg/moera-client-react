import React from 'react';
import { connect } from 'react-redux';

import { browserApiSet, connectionsSet, homeOwnerSet, homeRestore } from "state/home/actions";
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

    sendServiceWorkerHomeLocation(location) {
        if (!window.navigator.serviceWorker) {
            console.log("No Service Worker.");
            return;
        }

        window.navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.active) {
                registration.active.postMessage({
                    type: "HOME_ROOT_PAGE",
                    location
                });
            } else {
                console.log("No active Service Worker.");
            }
        });
    }

    loadedData(data) {
        const {
            home, homeRestore, homeOwnerSet, cartesSet, browserApiSet, connectionsSet, namingNamesPopulate,
            webPushSubscriptionSet, webPushInvitationRestore
        } = this.props;

        if (!data) {
            return;
        }

        if (data.names != null) {
            namingNamesPopulate(data.names);
        }

        const {location, nodeName, login, token, permissions} = data.home || {};
        if (data.clientId !== Browser.clientId
                && (location != null || login != null || token != null || permissions != null)
                && (location !== home.location || login !== home.login || token !== home.token)) {
            homeRestore(data.version, location, login, token, permissions, data.cartesIp, data.cartes, data.roots);
            if (nodeName) {
                homeOwnerSet(nodeName, null);
            }
            this.sendServiceWorkerHomeLocation(location);
            return;
        }

        browserApiSet(data.version);
        if (data.roots != null) {
            connectionsSet(data.roots);
        }
        if (data.clientId !== Browser.clientId) {
            cartesSet(data.cartesIp, data.cartes);
        }

        const webPush = data.webPush || {};
        webPushSubscriptionSet(webPush.subscriptionId || null);
        webPushInvitationRestore(webPush.invitationStage || 0, webPush.invitationTimestamp || 0);
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
        webPushSubscriptionSet, webPushInvitationRestore
    }
)(Storage);
