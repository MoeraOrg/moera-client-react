import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToSignUp } from "state/navigation/actions";
import { LocationInfo } from "location/LocationInfo";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    let actions = [];
    if (srcInfo.directories[0] !== "signup") {
        actions.push(goToSignUp(dstInfo.parameters["back"] ?? ""));
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("signup");
    if (state.connectPage.backHref) {
        info = info.withParameter("back", state.connectPage.backHref);
    }
    return info.noIndex().withTitle(i18n.t("sign-up"));
}
