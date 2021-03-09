/* eslint-disable no-restricted-globals */

import { getInstantTarget, getInstantTypeDetails } from "ui/instant/instant-types";
import { htmlToText } from "util/html";
import { redirectUrl } from "util/url";

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

async function getInstantUrl(packet) {
    const {originUrl, story} = packet;
    const {nodeName, href} = getInstantTarget(story);
    if (nodeName === ":") {
        return redirectUrl(self.origin, originUrl, null, originUrl, originUrl + href, story.trackingId);
    } else {
        return redirectUrl(self.origin, originUrl, nodeName, null, href, story.trackingId);
    }
}

export async function notificationClick(event) {
    const url = await getInstantUrl(event.notification.data);
    await self.clients.openWindow(url);
    event.notification.close();
}
