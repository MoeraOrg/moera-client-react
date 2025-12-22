import { trigger } from "state/trigger";
import { newLocation, updateLocation } from "state/navigation/actions";

export default [
    trigger(["JUMP_FAR", "JUMP_NEAR"], true, newLocation),
    trigger("GO_TO_PAGE", true, updateLocation),
    trigger("SETTINGS_LANGUAGE_CHANGED", true, updateLocation)
];
