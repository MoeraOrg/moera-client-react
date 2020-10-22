import React from 'react';
import { connect } from 'react-redux';

import { Browser } from "api";
import { browserApiSet, connectionsSet, homeOwnerSet, homeRestore } from "state/home/actions";
import { cartesSet } from "state/cartes/actions";
import { getHomeConnectionData } from "state/home/selectors";
import { namingNameLoaded, namingNamesPopulate } from "state/naming/actions";

class Storage extends React.PureComponent {

    componentDidMount() {
        window.addEventListener("message", this.messageReceived);
    }

    messageReceived = event => {
        // Only accept messages from the same frame
        if (event.source !== window) {
            return;
        }

        const message = event.data;

        // Only accept messages that we know are ours
        if (message === null || typeof message !== "object" || !message.source || message.source !== "moera") {
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
            home, homeRestore, homeOwnerSet, cartesSet, browserApiSet, connectionsSet, namingNamesPopulate
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
                homeOwnerSet(nodeName);
            }
            return;
        }

        browserApiSet(data.version);
        if (data.roots != null) {
            connectionsSet(data.roots);
        }
        if (data.clientId !== Browser.clientId) {
            cartesSet(data.cartesIp, data.cartes);
        }
    }

    storedName(data) {
        this.props.namingNameLoaded(data.name, data.latest, data.nodeUri);
    }

    render() {
        return null;
    }

}

export default connect(
    state => ({
        home: getHomeConnectionData(state)
    }),
    { homeRestore, homeOwnerSet, cartesSet, browserApiSet, connectionsSet, namingNamesPopulate, namingNameLoaded }
)(Storage);
