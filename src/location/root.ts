import { goToTimeline } from "state/navigation/actions";
import {
    isAtActivePeoplePage,
    isAtComplaintsPage,
    isAtComposePage,
    isAtConnectPage,
    isAtDetailedPostingPage,
    isAtEmailVerifiedPage,
    isAtExplorePage,
    isAtGrantPage,
    isAtInstantsPage,
    isAtMnemonicPage,
    isAtNewsPage,
    isAtPeoplePage,
    isAtProfilePage,
    isAtRemovalPage,
    isAtSearchPage,
    isAtSettingsPage,
    isAtSignUpPage,
    isAtStartReadingPage,
    isAtTimelinePage,
    isAtVerifyEmailPage
} from "state/navigation/selectors";
import { build as complaintsBuild, transform as complaintsTransform } from "location/complaints";
import { build as composeBuild, transform as composeTransform } from "location/compose";
import { build as connectBuild, transform as connectTransform } from "location/connect";
import { build as exploreBuild, transform as exploreTransform } from "location/explore";
import { build as grantBuild, transform as grantTransform } from "location/grant";
import { build as instantsBuild, transform as instantsTransform } from "location/instants";
import { build as mnemonicBuild, transform as mnemonicTransform } from "location/mnemonic";
import { build as newsBuild, transform as newsTransform } from "location/news";
import { build as peopleBuild, transform as peopleTransform } from "location/people";
import { build as postBuild, transform as postTransform } from "location/post";
import { build as profileBuild, transform as profileTransform } from "location/profile";
import { build as removalBuild, transform as removalTransform } from "location/removal";
import { build as searchBuild, transform as searchTransform } from "location/search";
import { build as settingsBuild, transform as settingsTransform } from "location/settings";
import { build as signupBuild, transform as signupTransform } from "location/signup";
import { build as startReadingBuild, transform as startReadingTransform } from "location/start-reading";
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
    if (dstInfo.directories[0] === "complaints") {
        return complaintsTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "removal") {
        return removalTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "grant") {
        return grantTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "search") {
        return searchTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "explore") {
        return exploreTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "instants") {
        return instantsTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "connect") {
        return connectTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "signup") {
        return signupTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "mnemonic") {
        return mnemonicTransform(srcInfo, dstInfo);
    }
    if (dstInfo.directories[0] === "start-reading") {
        return startReadingTransform(srcInfo, dstInfo);
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
    if (isAtProfilePage(state) || isAtEmailVerifiedPage(state) || isAtVerifyEmailPage(state)) {
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
    if (isAtComplaintsPage(state)) {
        return complaintsBuild(state, info);
    }
    if (isAtRemovalPage(state)) {
        return removalBuild(state, info);
    }
    if (isAtGrantPage(state)) {
        return grantBuild(state, info);
    }
    if (isAtSearchPage(state)) {
        return searchBuild(state, info);
    }
    if (isAtExplorePage(state) || isAtActivePeoplePage(state)) {
        return exploreBuild(state, info);
    }
    if (isAtInstantsPage(state)) {
        return instantsBuild(state, info);
    }
    if (isAtConnectPage(state)) {
        return connectBuild(state, info);
    }
    if (isAtSignUpPage(state)) {
        return signupBuild(state, info);
    }
    if (isAtMnemonicPage(state)) {
        return mnemonicBuild(state, info);
    }
    if (isAtStartReadingPage(state)) {
        return startReadingBuild(state, info);
    }
    return info;
}
