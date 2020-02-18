import React from 'react';
import { connect } from 'react-redux';
import { Client } from '@stomp/stompjs';
import * as URI from 'uri-js';

import { Browser, EventPacket, EVENT_SCHEMES, formatSchemaErrors } from "api";
import { eventAction } from "api/events/actions";

class Events extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.stomp = null;
        this.location = null;
        this.queueStartedAt = null;
        this.lastEvent = null;
    }

    componentDidMount() {
        this._connect();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location !== this.props.location || prevProps.token !== this.props.token) {
            this._disconnect();
            this._connect();
        }
    }

    _connect() {
        const {location, token} = this.props;

        if (location == null) {
            return;
        }
        if (location !== this.location) {
            this.location = location;
            this.queueStartedAt = null;
            this.lastEvent = null;
        }

        let connectHeaders = {
            "host": URI.parse(location).host
        };
        if (token != null) {
            connectHeaders["token"] = token;
        }
        this.stomp = new Client({
            brokerURL: location,
            onConnect: this.onConnect,
            connectHeaders
        });
        this.stomp.activate();
    }

    _disconnect() {
        if (this.stomp != null) {
            this.stomp.deactivate();
            this.stomp = null;
        }
    }

    onConnect = () => {
        let headers = {};
        if (this.queueStartedAt != null) {
            headers.seen = `${this.queueStartedAt},${this.lastEvent}`;
        }
        this.stomp.subscribe("/user/queue", this.onMessage, headers);
    };

    onMessage = message => {
        const {prefix, eventAction} = this.props;

        let packet = JSON.parse(message.body);
        if (!EventPacket(packet)) {
            console.error("Incorrect event packet received", formatSchemaErrors(EventPacket.errors));
            return;
        }
        const eventScheme = EVENT_SCHEMES[packet.event.type];
        if (eventScheme == null) {
            console.error("Unknown event type: " + packet.event.type);
            return;
        }
        if (!eventScheme(packet.event)) {
            console.error("Incorrect event received", formatSchemaErrors(eventScheme.errors));
            return;
        }
        if (packet.cid !== Browser.clientId) {
            eventAction(packet.event, prefix);
            this.queueStartedAt = packet.queueStartedAt;
            this.lastEvent = packet.ordinal;
        }
    };

    render() {
        return null;
    }

}

export default connect(
    null,
    { eventAction }
)(Events);
