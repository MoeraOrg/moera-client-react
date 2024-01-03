import { trigger } from "state/trigger";
import { namingNamesMaintenance, namingNamesReload, namingNamesUsed } from "state/naming/actions";
import { PostingSetAction } from "state/postings/actions";

export default [
    trigger(
        "POSTING_SET",
        true,
        (signal: PostingSetAction) =>
            namingNamesUsed([signal.payload.posting.ownerName, signal.payload.posting.receiverName ?? null])
    ),
    trigger("PULSE_1MIN", true, namingNamesMaintenance),
    trigger("SETTINGS_CLIENT_VALUES_LOADED", true, namingNamesReload)
];
