import { trigger } from "state/trigger";
import { bodyScrollUpdate, newLocation, updateLocation } from "state/navigation/actions";

export default [
    trigger("GO_TO_PAGE", true, newLocation),
    trigger(["DIALOG_OPENED", "DIALOG_CLOSED"], true, bodyScrollUpdate),
    trigger("SETTINGS_LANGUAGE_CHANGED", true, updateLocation)
];
