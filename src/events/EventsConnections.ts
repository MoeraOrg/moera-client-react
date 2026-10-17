import { EventSource } from "api/events";
import EventsBackend from "events/EventsBackend";
import { EventsConnection } from "events/message-types";

interface ConnectionBackend {
    connection: EventsConnection;
    backend: EventsBackend;
    active: boolean;
}

function isSameNode(first: EventsConnection, second: EventsConnection): boolean {
    return (first.sourceNode != null && first.sourceNode === second.sourceNode)
        || first.location === second.location;
}

function groupConnections(connections: EventsConnection[]): (EventsConnection & {prefix: EventSource[]})[] {
    const names = new Map<string, string>();
    for (const {location, sourceNode} of connections) {
        if (location != null && sourceNode != null) {
            names.set(location, sourceNode);
        }
    }
    const groups: (EventsConnection & {prefix: EventSource[]})[] = [];
    for (const requested of connections) {
        if (requested.location == null) {
            continue;
        }
        const connection = {...requested, sourceNode: requested.sourceNode ?? names.get(requested.location) ?? null};
        const prefixes = Array.isArray(connection.prefix) ? connection.prefix : [connection.prefix];
        const group = groups.find(existing => isSameNode(existing, connection));
        if (group == null) {
            groups.push({...connection, prefix: [...new Set(prefixes)]});
        } else {
            group.prefix = [...new Set([...group.prefix, ...prefixes])];
            group.sourceNode ??= connection.sourceNode;
            if (group.token == null && connection.token != null) {
                group.location = connection.location;
                group.token = connection.token;
            }
            group.carte ??= connection.carte;
        }
    }
    return groups;
}

export default class EventsConnections {

    private clientId: string = "";
    private backends: ConnectionBackend[] = [];

    public setClientId(clientId: string) {
        this.clientId = clientId;
        this.backends.forEach(({backend}) => backend.setClientId(clientId));
    }

    public async setup(connections: EventsConnection[]): Promise<void> {
        const unused = new Set(this.backends);
        const pending: Promise<void>[] = [];
        for (const connection of groupConnections(connections)) {
            const matches = [...unused].filter(item => isSameNode(item.connection, connection));
            let existing = matches.find(item => item.active) ?? matches[0];
            if (existing == null) {
                existing = {connection, backend: new EventsBackend(), active: true};
                this.backends.push(existing);
            }
            unused.delete(existing);
            existing.active = true;
            existing.connection = connection;
            existing.backend.setClientId(this.clientId);
            const {location, token, carte, prefix, sourceNode} = connection;
            pending.push(existing.backend.setup(location, token, carte, prefix, sourceNode));
        }
        for (const existing of unused) {
            existing.active = false;
            pending.push(
                existing.backend.setup(null, null, null, [], null).then(async () => {
                    // A new setup may have reused this backend while its socket was closing.
                    if (!existing.active) {
                        this.backends = this.backends.filter(item => item !== existing);
                        await existing.backend.dispose();
                    }
                })
            );
        }
        await Promise.all(pending);
    }

    public wakeUp() {
        this.backends.forEach(({backend}) => backend.wakeUp());
    }

}
