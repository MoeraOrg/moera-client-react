import { trigger } from "state/trigger";
import { remoteMediaMaintenance } from "state/remotemedia/actions";

export default [
    trigger("PULSE_10MIN", true, remoteMediaMaintenance)
];
