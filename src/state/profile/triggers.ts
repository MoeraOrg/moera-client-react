import i18n from 'i18next';

import { trigger } from "state/trigger";
import { ProfileAvatarConfirmDeleteAction, profileAvatarDelete } from "state/profile/actions";
import { confirmBox } from "state/confirmbox/actions";

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
]
