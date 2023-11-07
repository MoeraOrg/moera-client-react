import { trigger } from "state/trigger";
import { refreshShow } from "state/refresh/actions";

export default [
    trigger("WAKE_UP", true, refreshShow)
];
