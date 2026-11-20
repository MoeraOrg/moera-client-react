import type { RouteMatchCallback } from 'workbox-core';

const mockMatchers: RouteMatchCallback[] = [];

jest.mock('workbox-routing', () => ({
    registerRoute: (match: RouteMatchCallback) => mockMatchers.push(match)
}));
jest.mock('workbox-core', () => ({clientsClaim: jest.fn()}));
jest.mock('workbox-strategies', () => ({StaleWhileRevalidate: jest.fn()}));
jest.mock('workbox-broadcast-update', () => ({BroadcastUpdatePlugin: jest.fn()}));
jest.mock('workbox-expiration', () => ({ExpirationPlugin: jest.fn()}));
jest.mock("build-number", () => ({BUILD_NUMBER: "test"}), {virtual: true});

beforeAll(async () => {
    await import("service-worker");
});

function hasRoute(path: string, destination: RequestDestination, headers?: HeadersInit): boolean {
    const url = new URL(path, window.location.href);
    const request = new Request(url.href, {headers});
    Object.defineProperty(request, "destination", {value: destination});
    const event = new Event("fetch") as ExtendableEvent;
    const sameOrigin = url.origin === window.location.origin;
    return mockMatchers.some((match: RouteMatchCallback) => match({request, url, sameOrigin, event}));
}

test.each([
    "https://node.example/moera/media/public/attachment",
    "https://node.example/moera/media/private/attachment?grant=sample",
    "/static/attachment"
])("caches images and lets the browser handle byte ranges and video playback for %s", (url: string) => {
    expect(hasRoute(url, "image")).toBe(true);
    expect(hasRoute(url, "", {Range: "bytes=2-5"})).toBe(false);
    expect(hasRoute(url, "video")).toBe(false);
});
