import { trigger } from "state/trigger";
import { closeSourceDialog, OPEN_SOURCE_DIALOG } from "state/sourcedialog/actions";
import { dialogOpened } from "state/navigation/actions";

export default [
    trigger(OPEN_SOURCE_DIALOG, true, dialogOpened(closeSourceDialog())),
];
