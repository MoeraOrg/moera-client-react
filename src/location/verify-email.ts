import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToVerifyEmail } from "state/navigation/actions";
import { LocationInfo } from "location/LocationInfo";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    let actions = [];
    if (srcInfo.directories[0] !== "verify-email") {
        actions.push(goToVerifyEmail());
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    return info.sub("verify-email").noIndex().withTitle(i18n.t("confirm-your-email-address"));
}
