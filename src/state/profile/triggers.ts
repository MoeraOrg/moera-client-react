import i18n from 'i18next';

import { conj, trigger } from "state/trigger";
import { ProfileAvatarConfirmDeleteAction, profileAvatarDelete, profileLoad } from "state/profile/actions";
import { confirmBox } from "state/confirmbox/actions";
import { isConnectedToHome } from "state/home/selectors";
import { isAtEmailVerifiedPage } from "state/navigation/selectors";
import { isProfileToBeLoaded } from "state/profile/selectors";

export default [
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
    trigger(
        ["HOME_READY", "GO_TO_PAGE"],
        conj(isConnectedToHome, isAtEmailVerifiedPage, isProfileToBeLoaded),
        profileLoad
    ),
]
