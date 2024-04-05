/* eslint-disable no-restricted-globals */

// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules.

import { BroadcastUpdatePlugin } from 'workbox-broadcast-update';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

import { UseCacheKeyPlugin } from "sw/workbox-plugins";
import { BUILD_NUMBER } from "build-number";

console.log(`Started service worker revision ${BUILD_NUMBER}`);

clientsClaim();

// Precache all the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA

// @ts-ignore
// eslint-disable-next-line no-unused-vars
const ignored = self.__WB_MANIFEST;
// precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({request, url}) =>
        request.mode === "navigate"
        && (
            !url.pathname
            || url.pathname === "/"
            || url.pathname.startsWith("/@")
        ),
    new StaleWhileRevalidate({
        cacheName: "client",
        plugins: [
            new BroadcastUpdatePlugin(),
            new UseCacheKeyPlugin("/")
        ]
    })
);

registerRoute(
    ({url}) => url.origin === self.location.origin && url.pathname.startsWith("/static/"),
    new StaleWhileRevalidate({
        cacheName: "client",
        plugins: [
            new ExpirationPlugin({maxEntries: 248})
        ]
    })
);

registerRoute(
    ({url}) => url.origin === "https://cdnjs.cloudflare.com" && url.pathname.endsWith(".svg"),
    new StaleWhileRevalidate({
        cacheName: "twemoji",
        plugins: [
            new ExpirationPlugin({maxEntries: 64})
        ]
    })
);
