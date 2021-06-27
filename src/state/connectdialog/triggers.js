import { trigger } from "state/trigger";
import { cancelConnectDialog, OPEN_CONNECT_DIALOG } from "state/connectdialog/actions";
import { dialogOpened } from "state/navigation/actions";

export default [
    trigger(OPEN_CONNECT_DIALOG, true, dialogOpened(cancelConnectDialog())),
];
