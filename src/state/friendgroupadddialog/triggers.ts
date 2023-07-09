import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import {
    CLOSE_FRIEND_GROUP_ADD_DIALOG,
    closeFriendGroupAddDialog,
    OPEN_FRIEND_GROUP_ADD_DIALOG
} from "state/friendgroupadddialog/actions";

export default [
    trigger(OPEN_FRIEND_GROUP_ADD_DIALOG, true, dialogOpened(closeFriendGroupAddDialog())),
    trigger(CLOSE_FRIEND_GROUP_ADD_DIALOG, true, dialogClosed)
];
