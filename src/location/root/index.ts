import { goToTimeline } from "state/navigation/actions";
import {
    isAtComposePage,
    isAtDetailedPostingPage,
    isAtNewsPage,
    isAtPeoplePage,
    isAtProfilePage,
    isAtSettingsPage,
    isAtTimelinePage
} from "state/navigation/selectors";
import { build as composeBuild, transform as composeTransform } from "location/root/compose";
import { build as newsBuild, transform as newsTransform } from "location/root/news";
import { build as peopleBuild, transform as peopleTransform } from "location/root/people";
import { build as postBuild, transform as postTransform } from "location/root/post";
import { build as profileBuild, transform as profileTransform } from "location/root/profile";
import { build as settingsBuild, transform as settingsTransform } from "location/root/settings";
import { build as timelineBuild, transform as timelineTransform } from "location/root/timeline";
import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    if (dstInfo.directories.length === 0) {
        return [goToTimeline()];
    }
    if (dstInfo.directories[0] === "timeline") {
        return timelineTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "post") {
        return postTransform(srcInfo, dstInfo);
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
    if (dstInfo.directories[0] === "news") {
        return newsTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "people") {
        return peopleTransform(srcInfo, dstInfo);
    }
    return [];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    if (isAtTimelinePage(state)) {
        return timelineBuild(state, info);
    }
    if (isAtDetailedPostingPage(state)) {
        return postBuild(state, info);
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
    if (isAtNewsPage(state)) {
        return newsBuild(state, info);
    }
    if (isAtPeoplePage(state)) {
        return peopleBuild(state, info);
    }
    return info;
}
