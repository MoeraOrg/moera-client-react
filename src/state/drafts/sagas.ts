import { Node, NodeApiError } from "api";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { REL_HOME } from "util/rel-node-name";

export async function deleteDraft(caller: WithContext<ClientAction> | null, id: string) {
    try {
        await Node.deleteDraft(caller, REL_HOME, id, ["draft.not-found"]);
        if (window.Android != null && window.Android.getApiVersion() >= 3) {
            window.Android.abandonDraft(id);
        }
    } catch (e) {
        if (e instanceof NodeApiError) {
            if (window.Android != null && window.Android.getApiVersion() >= 3) {
                window.Android.abandonDraft(id);
            }
            throw e;
        }
    }
}
