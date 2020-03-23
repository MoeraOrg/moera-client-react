import React from 'react';
import { connect } from 'react-redux';

import { Browser } from "api";
import { browserApiSet, connectionsSet, homeOwnerSet, homeRestore } from "state/home/actions";
import { cartesSet } from "state/cartes/actions";

class Storage extends React.PureComponent {

    componentDidMount() {
        window.addEventListener("message", this.messageReceived);
        try {
            // Call the browser extension to inject communication code
            fetch("https://moera.please.start.communication/");
        } catch (e) {
            // The request must fail
        }
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

            default:
                return;
        }
    };

    loadedData(data) {
        const {homeRestore, homeOwnerSet, cartesSet, browserApiSet, connectionsSet} = this.props;

        if (!data) {
            return;
        }

        const {location, nodeName, login, token, permissions} = data.home || {};
        if (data.clientId !== Browser.clientId
                && (location != null || login != null || token != null || permissions != null)) {
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

    render() {
        return null;
    }

}

export default connect(
    null,
    { homeRestore, homeOwnerSet, cartesSet, browserApiSet, connectionsSet }
)(Storage);
