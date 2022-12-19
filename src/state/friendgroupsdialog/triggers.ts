import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import {
    CLOSE_FRIEND_GROUPS_DIALOG,
    closeFriendGroupsDialog,
    OPEN_FRIEND_GROUPS_DIALOG
} from "state/friendgroupsdialog/actions";

export default [
    trigger(OPEN_FRIEND_GROUPS_DIALOG, true, dialogOpened(closeFriendGroupsDialog())),
    trigger(CLOSE_FRIEND_GROUPS_DIALOG, true, dialogClosed)
];
