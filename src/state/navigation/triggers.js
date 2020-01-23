import { trigger } from "state/trigger";
import { GO_TO_PAGE, newLocation } from "state/navigation/actions";

export default [
    trigger(GO_TO_PAGE, true, newLocation)
];
