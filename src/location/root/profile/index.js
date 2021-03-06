import { goToProfile } from "state/navigation/actions";
import { profileEdit, profileEditCancel } from "state/profile/actions";
import { isProfileEditing } from "state/profile/selectors";
import { atOwner } from "util/misc";

export function transform(srcInfo, dstInfo) {
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

export function build(state, info) {
    info = info.sub("profile");
    const editing = isProfileEditing(state);
    info = editing ? info.withParameter("edit", "true") : info;
    return info.withTitle((!editing ? "Profile" : "Edit Profile") + atOwner(state));
}
