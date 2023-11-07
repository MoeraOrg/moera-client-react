import { conj, trigger } from "state/trigger";
import {
    PROFILE_AVATAR_CONFIRM_DELETE,
    PROFILE_AVATAR_CREATED,
    PROFILE_CLOSE_AVATAR_EDIT_DIALOG,
    PROFILE_OPEN_AVATAR_EDIT_DIALOG,
    PROFILE_UPDATE_SUCCEEDED,
    ProfileAvatarConfirmDeleteAction,
    profileAvatarDelete,
    profileCloseAvatarEditDialog,
    profileEditConflict,
    profileLoad
} from "state/profile/actions";
import { isProfileEditing } from "state/profile/selectors";
import { bottomMenuHide, bottomMenuShow, dialogClosed, dialogOpened, newLocation } from "state/navigation/actions";
import { isAtProfilePage } from "state/navigation/selectors";
import { EVENT_NODE_PROFILE_UPDATED } from "api/events";
import { confirmBox } from "state/confirmbox/actions";

export default [
    trigger("GO_TO_PAGE", conj(isAtProfilePage, isProfileEditing), () => profileLoad()),
    trigger(
        ["HOME_INTRODUCED", "WAKE_UP", "PROFILE_EDIT"],
        conj(isAtProfilePage, isProfileEditing),
        () => profileLoad()
    ),
    trigger(["PROFILE_EDIT", "PROFILE_EDIT_CANCEL", "PROFILE_UPDATE_SUCCEEDED"], isAtProfilePage, newLocation),
    trigger("PROFILE_EDIT", isAtProfilePage, bottomMenuHide),
    trigger(["PROFILE_EDIT_CANCEL", "PROFILE_UPDATE_SUCCEEDED"], isAtProfilePage, bottomMenuShow),
    trigger(
        PROFILE_AVATAR_CONFIRM_DELETE,
        true,
        (signal: ProfileAvatarConfirmDeleteAction) =>
            confirmBox("Delete the avatar?", "Delete", "Cancel",
                profileAvatarDelete(signal.payload.id, signal.payload.onDeleted))),
    trigger(PROFILE_OPEN_AVATAR_EDIT_DIALOG, true, dialogOpened(profileCloseAvatarEditDialog())),
    trigger(PROFILE_CLOSE_AVATAR_EDIT_DIALOG, true, dialogClosed),
    trigger(PROFILE_AVATAR_CREATED, true, dialogClosed),
    trigger(EVENT_NODE_PROFILE_UPDATED, conj(isAtProfilePage, isProfileEditing), profileEditConflict)
]
