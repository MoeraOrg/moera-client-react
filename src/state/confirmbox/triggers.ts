import { trigger } from "state/trigger";
import { bodyScrollUpdate } from "state/navigation/actions";

export default [
    trigger(["CONFIRM_BOX", "CLOSE_CONFIRM_BOX"], true, bodyScrollUpdate)
];
