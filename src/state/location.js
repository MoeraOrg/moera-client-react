import { goToTimeline } from "state/navigation/actions";
import {
    isAtComposePage,
    isAtDetailedPostingPage,
    isAtProfilePage,
    isAtSettingsPage,
    isAtTimelinePage
} from "state/navigation/selectors";
import { build as timelineBuild, transform as timelineTransform } from "state/feeds/location";
import { build as postingBuild, transform as postingTransform } from "state/detailedposting/location";
import { build as composeBuild, transform as composeTransform } from "state/compose/location";
import { build as profileBuild, transform as profileTransform } from "state/profile/location";
import { build as settingsBuild, transform as settingsTransform } from "state/settings/location";

export function transform(srcInfo, dstInfo) {
    if (dstInfo.directories.length === 0) {
        return [goToTimeline()];
    }
    if (dstInfo.directories[0] === "timeline") {
        return timelineTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "post") {
        return postingTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "compose") {
        return composeTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "profile") {
        return profileTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "settings") {
        return settingsTransform(srcInfo, dstInfo);
    }
    return [];
}

export function build(state, info) {
    if (isAtTimelinePage(state)) {
        return timelineBuild(state, info);
    }
    if (isAtDetailedPostingPage(state)) {
        return postingBuild(state, info);
    }
    if (isAtComposePage(state)) {
        return composeBuild(state, info);
    }
    if (isAtProfilePage(state)) {
        return profileBuild(state, info);
    }
    if (isAtSettingsPage(state)) {
        return settingsBuild(state, info);
    }
    return info;
}
