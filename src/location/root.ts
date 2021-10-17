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
import { build as composeBuild, transform as composeTransform } from "location/compose";
import { build as newsBuild, transform as newsTransform } from "location/news";
import { build as peopleBuild, transform as peopleTransform } from "location/people";
import { build as postBuild, transform as postTransform } from "location/post";
import { build as profileBuild, transform as profileTransform } from "location/profile";
import { build as settingsBuild, transform as settingsTransform } from "location/settings";
import { build as timelineBuild, transform as timelineTransform } from "location/timeline";
import { build as mediaBuild } from "location/media";
import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { isLightBoxShown } from "state/lightbox/selectors";

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
    if (isLightBoxShown(state)) {
        return mediaBuild(state, info);
    }
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
