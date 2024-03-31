import i18n from 'i18next';

import { conj, trigger } from "state/trigger";
import {
    ProfileAvatarConfirmDeleteAction,
    profileAvatarDelete,
    profileEditConflict,
    profileLoad
} from "state/profile/actions";
import { isProfileEditing } from "state/profile/selectors";
import { bottomMenuHide, bottomMenuShow, newLocation } from "state/navigation/actions";
import { isAtProfilePage } from "state/navigation/selectors";
import { confirmBox } from "state/confirmbox/actions";

export default [
    trigger("GO_TO_PAGE", conj(isAtProfilePage, isProfileEditing), () => profileLoad()),
    trigger(
        ["HOME_READY", "WAKE_UP", "PROFILE_EDIT"],
        conj(isAtProfilePage, isProfileEditing),
        () => profileLoad()
    ),
    trigger(["PROFILE_EDIT", "PROFILE_EDIT_CANCEL", "PROFILE_UPDATE_SUCCEEDED"], isAtProfilePage, newLocation),
    trigger("PROFILE_EDIT", isAtProfilePage, bottomMenuHide),
    trigger(["PROFILE_EDIT_CANCEL", "PROFILE_UPDATE_SUCCEEDED"], isAtProfilePage, bottomMenuShow),
    trigger(
        "PROFILE_AVATAR_CONFIRM_DELETE",
        true,
        (signal: ProfileAvatarConfirmDeleteAction) =>
            confirmBox({
                message: i18n.t("delete-avatar"),
                yes: i18n.t("delete"),
                no: i18n.t("cancel"),
                onYes: profileAvatarDelete(signal.payload.id, signal.payload.onDeleted)
            })),
    trigger("EVENT_NODE_PROFILE_UPDATED", conj(isAtProfilePage, isProfileEditing), profileEditConflict)
]
