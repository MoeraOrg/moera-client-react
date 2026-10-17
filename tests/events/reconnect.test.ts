import { TextDecoder, TextEncoder } from 'util';

import EventsBackend from "events/EventsBackend";

Object.assign(globalThis, {TextDecoder, TextEncoder});

class TestSocket {

    public readyState: number = 1;
    public onmessage: (event: {data: string}) => void = () => undefined;
    public onclose: (event: CloseEvent) => void = () => undefined;
    public send = jest.fn();
    public close = jest.fn(() => { this.readyState = 2; });

    public receive(frame: string) {
        this.onmessage({data: frame + "\0"});
    }

    public finishClosing() {
        this.readyState = 3;
        this.onclose({} as CloseEvent);
    }

}

let sockets: TestSocket[];

beforeEach(() => {
    jest.useFakeTimers();
    sockets = [];
    jest.spyOn(globalThis, "WebSocket").mockImplementation(() => {
        const socket = new TestSocket();
        sockets.push(socket);
        return socket as unknown as WebSocket;
    });
    jest.spyOn(globalThis, "postMessage").mockImplementation(() => undefined);
});

afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
});

async function connect(): Promise<EventsBackend> {
    const backend = new EventsBackend();
    await backend.setup("wss://author.example/moera/api/events", "token", null, "HOME", "author");
    sockets[0].receive("CONNECTED\nversion:1.2\nheart-beat:0,0\n\n");
    return backend;
}

test("recovers after missing pings even when the broker never acknowledges DISCONNECT", async () => {
    const backend = await connect();
    const socket = sockets[0];
    socket.receive("MESSAGE\nsubscription:sub-0\nmessage-id:1\n\n" + JSON.stringify({
        queueStartedAt: 1, ordinal: 10, event: {type: "PING"}
    }));

    await jest.advanceTimersByTimeAsync(130000);
    expect(socket.send).toHaveBeenCalledWith(expect.stringContaining("DISCONNECT\n"));
    expect(socket.close).not.toHaveBeenCalled();

    const updating = backend.setup("wss://author.example/moera/api/events", "new-token", null, "HOME", "author");
    await jest.advanceTimersByTimeAsync(5000);
    expect(socket.close).toHaveBeenCalledTimes(1);
    expect(sockets).toHaveLength(1);

    socket.finishClosing();
    await updating;
    expect(sockets).toHaveLength(2);
    expect(sockets[1].send).toHaveBeenCalledWith(expect.stringContaining("token:new-token\n"));
    sockets[1].receive("CONNECTED\nversion:1.2\nheart-beat:0,0\n\n");
    expect(sockets[1].send).toHaveBeenCalledWith(expect.stringContaining("seen:1,10\n"));
});

test("clears the shutdown timeout when the broker acknowledges DISCONNECT", async () => {
    const backend = await connect();
    const socket = sockets[0];
    const stopping = backend.dispose();
    await jest.advanceTimersByTimeAsync(0);
    const frame = socket.send.mock.calls.find(([frame]: [string]) => frame.startsWith("DISCONNECT\n"))![0];
    const receipt = /\nreceipt:([^\n]+)/.exec(frame)![1];
    socket.receive(`RECEIPT\nreceipt-id:${receipt}\n\n`);
    expect(socket.close).toHaveBeenCalledTimes(1);

    socket.finishClosing();
    await stopping;
    expect(jest.getTimerCount()).toBe(0);
    await jest.advanceTimersByTimeAsync(5000);
    expect(socket.close).toHaveBeenCalledTimes(1);
    expect(sockets).toHaveLength(1);
});
