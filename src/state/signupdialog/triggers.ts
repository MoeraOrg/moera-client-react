import { trigger } from "state/trigger";
import { goHomeLocation } from "state/navigation/actions";

export default [
    trigger("MNEMONIC_CLOSE", true, goHomeLocation("/news", null, null))
];
