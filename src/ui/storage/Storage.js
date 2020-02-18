import React from 'react';
import { connect } from 'react-redux';

import { Browser } from "api";
import { homeRestore } from "state/home/actions";
import { cartesSet } from "state/cartes/actions";

class Storage extends React.Component {

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
        if (!data || data.clientId === Browser.clientId) {
            return;
        }

        const {location, login, token, permissions} = data.home || {};
        if (location != null || login != null || token != null || permissions != null) {
            this.props.homeRestore(location, login, token, permissions, data.cartesIp, data.cartes);
        } else {
            this.props.cartesSet(data.cartesIp, data.cartes);
        }
    }

    render() {
        return null;
    }

}

export default connect(
    null,
    { homeRestore, cartesSet }
)(Storage);
