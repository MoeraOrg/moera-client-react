import { trigger } from "state/trigger";
import { closeImageEditDialog, imageEditDialogLoad } from "state/imageeditdialog/actions";
import { dialogClosed, dialogOpened } from "state/navigation/actions";

export default [
    trigger("OPEN_IMAGE_EDIT_DIALOG", true, imageEditDialogLoad),
    trigger("OPEN_IMAGE_EDIT_DIALOG", true, dialogOpened(closeImageEditDialog())),
    trigger("CLOSE_IMAGE_EDIT_DIALOG", true, dialogClosed),
    trigger("IMAGE_EDIT_DIALOG_POST_SUCCEEDED", true, dialogClosed)
];
