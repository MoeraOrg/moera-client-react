import { Client, IFrame, IMessage, StompConfig } from '@stomp/stompjs';

import { EventSource } from "api/events";
import { EventsConnection, eventsSetClientIdMessage, eventsWakeUpMessage } from "events/message-types";

jest.mock("@stomp/stompjs");

let clients: Client[];

beforeEach(() => {
    jest.useFakeTimers();
    clients = [];
    jest.spyOn(globalThis, "postMessage").mockImplementation(() => undefined);
    jest.isolateModules(() => {
        const {Client: WorkerClient} = jest.requireMock("@stomp/stompjs") as {Client: jest.Mock};
        WorkerClient.mockImplementation((config: StompConfig) => {
            const client = {
                ...config, activate: jest.fn(), deactivate: jest.fn().mockResolvedValue(undefined),
                subscribe: jest.fn()
            } as unknown as Client;
            clients.push(client);
            return client;
        });
        require("events/index");
    });
});

afterEach(() => {
    globalThis.onmessage = null;
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
});

function connection(prefix: EventSource | EventSource[], sourceNode: string = "author"): EventsConnection {
    return {location: `wss://${sourceNode}.example/moera/api/events`, token: null, carte: "carte", prefix, sourceNode};
}

async function setup(connections: EventsConnection[]): Promise<void> {
    await globalThis.onmessage!({data: {type: "SETUP_CONNECTIONS", payload: {connections}}} as MessageEvent);
}

function subscribe(client: Client) {
    client.onConnect({} as IFrame);
    const onMessage = jest.mocked(client.subscribe).mock.calls[0][1];
    return (event: {type: string; [key: string]: unknown}, ordinal: number, cid?: string, sentAt?: number) => {
        onMessage({body: JSON.stringify({queueStartedAt: 1, ordinal, cid, sentAt, event})} as IMessage);
    };
}

function deliveredTypes(): string[] {
    return jest.mocked(globalThis.postMessage).mock.calls
        .map(([action]: [{type: string}, ...unknown[]]) => action.type);
}

const reaction = {ownerName: "alice", negative: false, emoji: 128077, moment: 100};
const added = {type: "POSTING_REACTION_ADDED", id: "post-1", reaction};
const changed = {type: "POSTING_REACTIONS_CHANGED", id: "post-1"};

test("uses one socket for all consumers of the same node and dispatches each prefix once", async () => {
    await setup([
        connection("HOME"), connection(["NODE", "RECEIVER"]), connection("RECEIVER"), connection("RECEIVER")
    ]);

    expect(clients).toHaveLength(1);
    const send = subscribe(clients[0]);
    send(added, 1);
    send(changed, 2);
    expect(deliveredTypes()).toEqual([
        "EVENT_HOME_POSTING_REACTION_ADDED", "EVENT_NODE_POSTING_REACTION_ADDED",
        "EVENT_RECEIVER_POSTING_REACTION_ADDED", "EVENT_HOME_POSTING_REACTIONS_CHANGED",
        "EVENT_NODE_POSTING_REACTIONS_CHANGED", "EVENT_RECEIVER_POSTING_REACTIONS_CHANGED"
    ]);
});

test("keeps separate sockets for different nodes", async () => {
    await setup([connection("HOME", "viewer"), connection("NODE"), connection("RECEIVER", "other")]);

    expect(clients).toHaveLength(3);
    clients.forEach((client: Client) => subscribe(client)(changed, 1));
    expect(deliveredTypes()).toEqual([
        "EVENT_HOME_POSTING_REACTIONS_CHANGED", "EVENT_NODE_POSTING_REACTIONS_CHANGED",
        "EVENT_RECEIVER_POSTING_REACTIONS_CHANGED"
    ]);
    expect(jest.mocked(globalThis.postMessage).mock.calls[2][0].payload.sourceNode).toBe("other");
});

test("shares a socket before the node name is known and keeps it when the name arrives", async () => {
    await setup([{...connection("HOME"), sourceNode: null}, connection("NODE")]);
    expect(clients).toHaveLength(1);
    const send = subscribe(clients[0]);

    await setup([connection("HOME"), connection("NODE")]);
    send(changed, 1);

    expect(clients).toHaveLength(1);
    expect(clients[0].deactivate).not.toHaveBeenCalled();
    expect(deliveredTypes()).toEqual(["EVENT_HOME_POSTING_REACTIONS_CHANGED", "EVENT_NODE_POSTING_REACTIONS_CHANGED"]);
    expect(jest.mocked(globalThis.postMessage).mock.calls[0][0].payload.sourceNode).toBe("author");
});

test("groups different URLs for the same named node", async () => {
    await setup([connection("HOME"), {...connection("NODE"), location: "wss://alias.example/moera/api/events"}]);

    expect(clients).toHaveLength(1);
    subscribe(clients[0])(changed, 1);
    expect(deliveredTypes()).toEqual(["EVENT_HOME_POSTING_REACTIONS_CHANGED", "EVENT_NODE_POSTING_REACTIONS_CHANGED"]);
});

test("resolves an unnamed connection through another consumer of its URL before grouping", async () => {
    const alias = "wss://alias.example/moera/api/events";
    await setup([
        connection("HOME"), {...connection("NODE"), sourceNode: null, location: alias},
        {...connection("RECEIVER"), location: alias}
    ]);

    expect(clients).toHaveLength(1);
    subscribe(clients[0])(changed, 1);
    expect(deliveredTypes()).toEqual([
        "EVENT_HOME_POSTING_REACTIONS_CHANGED", "EVENT_NODE_POSTING_REACTIONS_CHANGED",
        "EVENT_RECEIVER_POSTING_REACTIONS_CHANGED"
    ]);
});

test("preserves the cursor when switching between URLs of the same named node", async () => {
    const alias = {...connection("NODE"), location: "wss://alias.example/moera/api/events"};
    await setup([connection("HOME"), alias]);
    subscribe(clients[0])(added, 10);

    await setup([alias]);
    expect(clients).toHaveLength(2);
    expect(clients[0].deactivate).toHaveBeenCalledTimes(1);
    subscribe(clients[1]);
    expect(clients[1].subscribe).toHaveBeenCalledWith("/user/queue", expect.any(Function), {seen: "1,10"});
});

test("updates consumers without reconnecting when the current page moves to another node", async () => {
    await setup([connection("HOME"), connection(["NODE", "RECEIVER"])]);
    const sendHome = subscribe(clients[0]);

    await setup([connection("HOME"), connection(["NODE", "RECEIVER"], "other")]);
    expect(clients).toHaveLength(2);
    expect(clients[0].deactivate).not.toHaveBeenCalled();
    sendHome(changed, 1);
    subscribe(clients[1])(changed, 1);
    expect(deliveredTypes()).toEqual([
        "EVENT_HOME_POSTING_REACTIONS_CHANGED", "EVENT_NODE_POSTING_REACTIONS_CHANGED",
        "EVENT_RECEIVER_POSTING_REACTIONS_CHANGED"
    ]);

    jest.mocked(globalThis.postMessage).mockClear();
    await setup([connection("HOME"), connection(["NODE", "RECEIVER"])]);
    expect(clients).toHaveLength(2);
    expect(clients[1].deactivate).toHaveBeenCalledTimes(1);
    sendHome(changed, 2);
    expect(deliveredTypes()).toEqual([
        "EVENT_HOME_POSTING_REACTIONS_CHANGED", "EVENT_NODE_POSTING_REACTIONS_CHANGED",
        "EVENT_RECEIVER_POSTING_REACTIONS_CHANGED"
    ]);
});

test("keeps the socket and event cursor when its last consumer changes role", async () => {
    await setup([connection("NODE")]);
    const send = subscribe(clients[0]);
    send(added, 10);
    await setup([connection("RECEIVER")]);
    expect(clients).toHaveLength(1);
    expect(clients[0].deactivate).not.toHaveBeenCalled();

    clients[0].onConnect({} as IFrame);
    expect(clients[0].subscribe).toHaveBeenLastCalledWith("/user/queue", expect.any(Function), {seen: "1,10"});
    jest.mocked(globalThis.postMessage).mockClear();
    send(changed, 11);
    expect(deliveredTypes()).toEqual(["EVENT_RECEIVER_POSTING_REACTIONS_CHANGED"]);
});

test("closes unused sockets, clears their timers and ignores their late callbacks", async () => {
    await setup([connection("NODE")]);
    const send = subscribe(clients[0]);
    await setup([]);
    send(added, 1);
    clients[0].onConnect({} as IFrame);

    expect(clients[0].deactivate).toHaveBeenCalledTimes(1);
    expect(clients[0].subscribe).toHaveBeenCalledTimes(1);
    expect(globalThis.postMessage).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
});

test("uses an available token for a shared connection", async () => {
    await setup([connection("NODE"), {...connection("HOME"), token: "home-token", carte: null}]);
    expect(clients).toHaveLength(1);
    expect(clients[0].connectHeaders.token).toBe("home-token");
});

test("waits for the old socket to close before changing credentials and resumes its cursor", async () => {
    await setup([connection("HOME"), connection("NODE")]);
    const oldClient = clients[0];
    const sendOld = subscribe(oldClient);
    sendOld(added, 10);
    jest.mocked(globalThis.postMessage).mockClear();
    let close!: () => void;
    jest.mocked(oldClient.deactivate).mockReturnValueOnce(new Promise<void>((resolve: () => void) => { close = resolve; }));

    const updating = setup([{...connection("HOME"), token: "new-token"}, connection("NODE")]);
    for (let i = 0; i < 10; i++) {
        await Promise.resolve();
    }
    expect(oldClient.deactivate).toHaveBeenCalledTimes(1);
    expect(clients).toHaveLength(1);
    sendOld(changed, 11);
    expect(globalThis.postMessage).not.toHaveBeenCalled();

    close();
    await updating;
    expect(clients).toHaveLength(2);
    subscribe(clients[1])(changed, 11);
    expect(clients[1].subscribe).toHaveBeenCalledWith("/user/queue", expect.any(Function), {seen: "1,10"});
    expect(deliveredTypes()).toEqual(["EVENT_HOME_POSTING_REACTIONS_CHANGED", "EVENT_NODE_POSTING_REACTIONS_CHANGED"]);
});

test("updates routing while another node's socket is still closing", async () => {
    await setup([connection("HOME"), connection("NODE", "other")]);
    const sendHome = subscribe(clients[0]);
    const sendOther = subscribe(clients[1]);
    let close!: () => void;
    jest.mocked(clients[1].deactivate).mockReturnValueOnce(
        new Promise<void>((resolve: () => void) => { close = resolve; })
    );

    const updating = setup([connection("HOME"), connection("NODE")]);
    for (let i = 0; i < 10; i++) {
        await Promise.resolve();
    }
    sendHome(changed, 1);
    sendOther(changed, 1);
    const types = deliveredTypes();
    close();
    await updating;

    expect(types).toEqual(["EVENT_HOME_POSTING_REACTIONS_CHANGED", "EVENT_NODE_POSTING_REACTIONS_CHANGED"]);
});

test("reuses a closing backend when its node is requested again", async () => {
    await setup([connection("NODE")]);
    let close!: () => void;
    jest.mocked(clients[0].deactivate).mockReturnValueOnce(
        new Promise<void>((resolve: () => void) => { close = resolve; })
    );
    const removing = setup([]);
    const restoring = setup([connection("RECEIVER")]);
    for (let i = 0; i < 10; i++) {
        await Promise.resolve();
    }
    expect(clients).toHaveLength(1);
    close();
    await Promise.all([removing, restoring]);

    expect(clients).toHaveLength(2);
    expect(jest.getTimerCount()).toBe(1);
    subscribe(clients[1])(changed, 1);
    expect(deliveredTypes()).toEqual(["EVENT_RECEIVER_POSTING_REACTIONS_CHANGED"]);
});

test("preserves self-event filtering for existing and newly created shared connections", async () => {
    await setup([connection("HOME"), connection("NODE")]);
    const sendHome = subscribe(clients[0]);
    globalThis.onmessage!({data: eventsSetClientIdMessage("client-1")} as MessageEvent);
    await setup([connection("HOME"), connection("NODE"), connection("RECEIVER", "other")]);

    for (const send of [sendHome, subscribe(clients[1])]) {
        send({type: "POSTING_UPDATED", id: "post-1"}, 1, "client-1");
        send(added, 2, "client-1");
    }
    expect(deliveredTypes()).toEqual([
        "EVENT_HOME_POSTING_REACTION_ADDED", "EVENT_NODE_POSTING_REACTION_ADDED",
        "EVENT_RECEIVER_POSTING_REACTION_ADDED"
    ]);
});

test("wakes up only through a connection that currently serves HOME", async () => {
    await setup([connection("NODE")]);
    const send = subscribe(clients[0]);
    const startedAt = Math.floor(Date.now() / 1000);
    send({type: "PING"}, 1, undefined, startedAt);
    jest.setSystemTime(Date.now() + 11 * 60 * 1000);
    globalThis.onmessage!({data: eventsWakeUpMessage()} as MessageEvent);
    expect(globalThis.postMessage).not.toHaveBeenCalled();

    await setup([connection("HOME"), connection("NODE")]);
    globalThis.onmessage!({data: eventsWakeUpMessage()} as MessageEvent);
    expect(deliveredTypes()).toEqual(["WAKE_UP"]);

    jest.mocked(globalThis.postMessage).mockClear();
    await setup([connection("NODE")]);
    jest.setSystemTime(Date.now() + 11 * 60 * 1000);
    globalThis.onmessage!({data: eventsWakeUpMessage()} as MessageEvent);
    expect(globalThis.postMessage).not.toHaveBeenCalled();
});
