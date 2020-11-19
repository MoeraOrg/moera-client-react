import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { Client } from '@stomp/stompjs';
import * as URI from 'uri-js';

import { ALLOWED_SELF_EVENTS, Browser, EVENT_SCHEMES, EventPacket, formatSchemaErrors } from "api";
import { eventAction } from "api/events/actions";
import { now } from "util/misc";

class Events extends React.PureComponent {

    static propTypes = {
        location: PropType.string,
        token: PropType.string,
        prefix: PropType.oneOfType([PropType.arrayOf(PropType.string), PropType.string]),
        sourceNode: PropType.string,
        onWakeUp: PropType.func
    }

    #stomp = null;
    #location = null;
    #queueStartedAt = null;
    #lastEvent = null;
    #lastEventSentAt = null;

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
        if (location !== this.#location) {
            this.#location = location;
            this.#queueStartedAt = null;
            this.#lastEvent = null;
            this.#lastEventSentAt = null;
        }

        const connectHeaders = {
            "host": URI.parse(location).host
        };
        if (token != null) {
            connectHeaders["token"] = token;
        }
        this.#stomp = new Client({
            brokerURL: location,
            onConnect: this.onConnect,
            connectHeaders
        });
        this.#stomp.activate();
    }

    _disconnect() {
        if (this.#stomp != null) {
            this.#stomp.deactivate();
            this.#stomp = null;
        }
    }

    onConnect = () => {
        const {onWakeUp} = this.props;

        if (this.#lastEventSentAt != null && onWakeUp != null) {
            const sleepTime = now() - this.#lastEventSentAt;
            if (sleepTime > 10 * 60) { // 10 minutes
                onWakeUp();
            }
        }

        const headers = {};
        if (this.#queueStartedAt != null) {
            headers.seen = `${this.#queueStartedAt},${this.#lastEvent}`;
        }
        this.#stomp.subscribe("/user/queue", this.onMessage, headers);
    };

    onMessage = message => {
        const {prefix, eventAction, sourceNode} = this.props;

        const packet = JSON.parse(message.body);
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
        if (ALLOWED_SELF_EVENTS.has(packet.event.type) || packet.cid !== Browser.clientId) {
            packet.event.sourceNode = sourceNode;
            if (Array.isArray(prefix)) {
                prefix.forEach(px => eventAction(packet.event, px));
            } else {
                eventAction(packet.event, prefix);
            }
            this.#queueStartedAt = packet.queueStartedAt;
            this.#lastEvent = packet.ordinal;
            this.#lastEventSentAt = packet.sentAt;
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
