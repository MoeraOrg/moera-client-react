import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToConnect } from "state/navigation/actions";
import { connectPageSetForm } from "state/connectpage/actions";
import { LocationInfo } from "location/LocationInfo";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    let actions = [];
    if (srcInfo.directories[0] !== "connect" && srcInfo.directories[0] !== "change-password") {
        actions.push(goToConnect(dstInfo.parameters["back"] ?? ""));
    }
    if (dstInfo.directories[0] === "change-password") {
        actions.push(connectPageSetForm(undefined, undefined, "change"));
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    const isChangePassword = state.connectPage.form === "change";
    if (isChangePassword) {
        info = info.sub("change-password")
    } else {
        info = info.sub("connect");
    }
    if (state.connectPage.backHref) {
        info = info.withParameter("back", state.connectPage.backHref);
    }
    return info.noIndex().withTitle(isChangePassword ? i18n.t("change-home-password") : i18n.t("connect"));
}
