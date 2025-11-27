import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { getNodeRootLocation } from "state/node/selectors";
import { goToProfile } from "state/navigation/actions";
import { isAtEmailVerifiedPage, isAtVerifyEmailPage } from "state/navigation/selectors";
import { LocationInfo } from "location/LocationInfo";
import { build as emailVerifiedBuild, transform as emailVerifiedTransform } from "location/email-verified";
import { build as verifyEmailBuild, transform as verifyEmailTransform } from "location/verify-email";
import { atOwner } from "util/names";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    if (dstInfo.directories.length > 1) {
        if (dstInfo.directories[1] === "email-verified") {
            return emailVerifiedTransform(srcInfo, dstInfo);
        }
        if (dstInfo.directories[1] === "verify-email") {
            return verifyEmailTransform(srcInfo, dstInfo);
        }
    }
    return [goToProfile()];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("profile");
    if (isAtEmailVerifiedPage(state)) {
        return emailVerifiedBuild(state, info);
    }
    if (isAtVerifyEmailPage(state)) {
        return verifyEmailBuild(state, info);
    }
    info = info.withCanonicalUrl(getNodeRootLocation(state) + info.toUrl());
    return info.withTitle(i18n.t("bio") + atOwner(state));
}
