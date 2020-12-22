import { trigger } from "state/trigger";
import { namingNamesMaintenance, namingNamesUsed } from "state/naming/actions";
import { POSTING_SET } from "state/postings/actions";
import { PULSE_1MIN } from "state/pulse/actions";

export default [
    trigger(
        POSTING_SET,
        true,
        signal => namingNamesUsed([signal.payload.posting.ownerName, signal.payload.posting.receiverName])
    ),
    trigger(PULSE_1MIN, true, namingNamesMaintenance)
];
