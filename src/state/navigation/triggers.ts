import { trigger } from "state/trigger";
import { newLocation, updateLocation } from "state/navigation/actions";

export default [
    trigger("GO_TO_PAGE", true, newLocation),
    trigger("SETTINGS_LANGUAGE_CHANGED", true, updateLocation)
];
