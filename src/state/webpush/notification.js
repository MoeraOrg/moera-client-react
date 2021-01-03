/* eslint-disable no-restricted-globals */

import { getInstantTarget, getInstantTypeDetails } from "ui/instant/instant-types";
import { htmlToText } from "util/html";
import { urlWithParameters } from "util/url";

export function buildNotification(packet) {
    switch (packet.type) {
        case "story-added": {
            const story = packet.story;
            const details = getInstantTypeDetails(story.storyType);
            return {
                type: "add",
                title: details != null ? details.title : "Moera",
                options: {
                    body: htmlToText(story.summary),
                    badge: "/pics/icon-72.png",
                    icon: "/pics/icon-o-512.png",
                    data: packet,
                    tag: story.id
                }
            }
        }

        case "story-deleted": {
            return {
                type: "delete",
                id: packet.id
            }
        }

        default:
            return null;
    }
}

function track(url, trackingId, originUrl) {
    url = self.origin + "/?href=" + encodeURIComponent(url);
    return trackingId != null
        ? urlWithParameters(originUrl + "/track", {trackingId, href: url}) : url;
}

async function getInstantUrl(packet) {
    const {originUrl, story} = packet;
    const {nodeName, href} = getInstantTarget(story);
    if (nodeName === ":") {
        return track(originUrl + href, story.trackingId, originUrl);
    } else {
        return urlWithParameters(originUrl + "/gotoname",
            {client: self.origin, name: nodeName, location: href, trackingId: story.trackingId});
    }
}

export async function notificationClick(event) {
    const url = await getInstantUrl(event.notification.data);
    await self.clients.openWindow(url);
    event.notification.close();
}
