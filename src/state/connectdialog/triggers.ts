import { trigger } from "state/trigger";
import { cancelConnectDialog } from "state/connectdialog/actions";
import { dialogClosed, dialogOpened } from "state/navigation/actions";

export default [
    trigger("OPEN_CONNECT_DIALOG", true, dialogOpened(cancelConnectDialog())),
    trigger("CANCEL_CONNECT_DIALOG", true, dialogClosed),
    trigger("CONNECTED_TO_HOME", true, dialogClosed)
];
