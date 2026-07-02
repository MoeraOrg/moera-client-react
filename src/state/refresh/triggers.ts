import { inv, trigger } from "state/trigger";
import { refreshCheckBuild, refreshShow } from "state/refresh/actions";
import { isRefreshConfirmingReload } from "state/refresh/selectors";

export default [
    trigger("WAKE_UP", true, refreshShow),
    trigger(["WAKE_UP", "PULSE_30MIN"], inv(isRefreshConfirmingReload), refreshCheckBuild),
];
