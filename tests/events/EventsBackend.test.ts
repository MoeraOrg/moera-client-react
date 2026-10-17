import { Client, IFrame, IMessage, StompConfig } from '@stomp/stompjs';

import EventsBackend from "events/EventsBackend";

jest.mock("@stomp/stompjs");

beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.mocked(Client).mockImplementation((config: StompConfig) => ({
        ...config,
        activate: jest.fn(),
        deactivate: jest.fn().mockResolvedValue(undefined),
        subscribe: jest.fn()
    }) as unknown as Client);
    jest.spyOn(globalThis, "postMessage").mockImplementation(() => undefined);
});

afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
});

test("reconnects when a dialog reopens on the same node", async () => {
    const backend = new EventsBackend();
    await backend.setup("wss://author.example/moera/api/events", null, "carte", "RECEIVER", "author");
    const firstClient = jest.mocked(Client).mock.results[0].value;

    await backend.setup(null, null, "carte", "RECEIVER", null);
    expect(firstClient.deactivate).toHaveBeenCalledTimes(1);

    await backend.setup("wss://author.example/moera/api/events", null, "carte", "RECEIVER", "author");
    expect(Client).toHaveBeenCalledTimes(2);
    expect(jest.mocked(Client).mock.results[1].value.activate).toHaveBeenCalledTimes(1);
});

test.each([
    "POSTING_REACTIONS_CHANGED", "POSTING_REACTION_ADDED", "POSTING_REACTION_DELETED",
    "COMMENT_REACTIONS_CHANGED", "COMMENT_REACTION_ADDED", "COMMENT_REACTION_DELETED"
])("delivers %s originating from this client", async (type: string) => {
    const backend = new EventsBackend();
    backend.setClientId("client-1");
    await backend.setup("wss://author.example/moera/api/events", null, "carte", "RECEIVER", "author");
    const client = jest.mocked(Client).mock.results[0].value;
    client.onConnect({} as IFrame);
    const onMessage = client.subscribe.mock.calls[0][1];
    const event = {
        type,
        id: "entry-1",
        ...(type.startsWith("COMMENT_") ? {postingId: "post-1", moment: 50} : {}),
        ...(!type.endsWith("REACTIONS_CHANGED") ? {
            reaction: {ownerName: "viewer", negative: false, emoji: 128077, moment: 100}
        } : {})
    };

    onMessage({body: JSON.stringify({queueStartedAt: 1, ordinal: 1, cid: "client-1", event})} as IMessage);

    expect(globalThis.postMessage).toHaveBeenCalledWith(expect.objectContaining({
        type: `EVENT_RECEIVER_${type}`,
        payload: expect.objectContaining({
            id: "entry-1", sourceNode: "author", ...(event.reaction != null ? {reaction: event.reaction} : {})
        })
    }));
});
