import { trigger } from "state/trigger";
import { bodyScrollUpdate } from "state/navigation/actions";

export default [
    trigger(["MESSAGE_BOX", "CLOSE_MESSAGE_BOX"], true, bodyScrollUpdate)
];
