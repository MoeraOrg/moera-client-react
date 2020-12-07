import { trigger } from "state/trigger";
import { WAKE_UP } from "state/navigation/actions";
import { refreshShow } from "state/refresh/actions";

export default [
    trigger(WAKE_UP, true, refreshShow)
];
