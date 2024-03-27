import { trigger } from "state/trigger";
import { imageEditDialogLoad } from "state/imageeditdialog/actions";

export default [
    trigger("OPEN_IMAGE_EDIT_DIALOG", true, imageEditDialogLoad)
];
