/* eslint-disable no-restricted-globals */

import { getInstantTarget, getInstantTypeDetails } from "ui/instant/instant-types";
import { htmlToText } from "util/html";
import { urlWithParameters } from "util/url";

export function buildNotification(story) {
    const details = getInstantTypeDetails(story.storyType);
    const {nodeName, href} = getInstantTarget(story);
    return {
        title: details != null ? details.title : "Moera",
        options: {
            body: htmlToText(story.summary),
            badge: "/pics/icon-72.png",
            icon: "/pics/icon-o-512.png",
            data: story,
            tag: nodeName + href
        }
    }
}

function track(url, trackingId) {
    url = self.origin + "/?href=" + encodeURIComponent(url);
    return trackingId != null
        ? urlWithParameters(self.homeRootPage + "/track", {trackingId, href: url}) : url;
}

async function getInstantUrl(story) {
    const {nodeName, href} = getInstantTarget(story);
    if (nodeName === ":") {
        return track(self.homeRootPage + href, story.trackingId);
    } else {
        return urlWithParameters(self.homeRootPage + "/gotoname",
            {client: self.origin, name: nodeName, location: href, trackingId: story.trackingId});
    }
}

export async function notificationClick(event) {
    const url = await getInstantUrl(event.notification.data);
    await self.clients.openWindow(url);
    event.notification.close();
}
