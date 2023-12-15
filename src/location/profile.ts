import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToProfile } from "state/navigation/actions";
import { profileEdit, profileEditCancel } from "state/profile/actions";
import { isProfileEditing } from "state/profile/selectors";
import { LocationInfo } from "location/LocationInfo";
import { atOwner } from "util/names";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    let actions = [];
    if (srcInfo.directories[0] !== "profile") {
        actions.push(goToProfile());
        srcInfo = srcInfo.withPath("/profile").withNoQuery();
    }
    if (dstInfo.parameters["edit"] === "true" && srcInfo.parameters["edit"] !== "true") {
        actions.push(profileEdit());
    }
    if (dstInfo.parameters["edit"] !== "true" && srcInfo.parameters["edit"] === "true") {
        actions.push(profileEditCancel());
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("profile");
    const editing = isProfileEditing(state);
    info = editing ? info.withParameter("edit", "true") : info;
    return info.withTitle((!editing ? i18n.t("profile") : i18n.t("edit-profile")) + atOwner(state));
}
