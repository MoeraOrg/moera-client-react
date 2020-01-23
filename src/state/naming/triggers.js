import { trigger } from "state/trigger";
import { NAMING_NAME_USED, namingNameLoad, namingNamesMaintenance, namingNameUsed } from "state/naming/actions";
import { isNamingNameToBeLoaded } from "state/naming/selectors";
import { POSTING_SET } from "state/postings/actions";
import { PULSE_10MIN } from "state/pulse/actions";

export default [
    trigger(
        NAMING_NAME_USED,
        (state, signal) => isNamingNameToBeLoaded(state, signal.payload.name),
        signal => namingNameLoad(signal.payload.name)
    ),
    trigger(POSTING_SET, true, signal => namingNameUsed(signal.payload.posting.ownerName)),
    trigger(POSTING_SET, true, signal => namingNameUsed(signal.payload.posting.receiverName)),
    trigger(PULSE_10MIN, true, namingNamesMaintenance)
];
