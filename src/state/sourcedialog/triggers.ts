import { trigger } from "state/trigger";
import { closeSourceDialog } from "state/sourcedialog/actions";
import { dialogClosed, dialogOpened } from "state/navigation/actions";

export default [
    trigger("OPEN_SOURCE_DIALOG", true, dialogOpened(closeSourceDialog())),
    trigger("CLOSE_SOURCE_DIALOG", true, dialogClosed)
];
