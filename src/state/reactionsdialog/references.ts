import { getRelNodeNameContext } from "state/home/selectors";
import { PostingReference } from "state/postings/state";
import { ClientState } from "state/state";
import { absoluteNodeName } from "util/rel-node-name";

export default function getReferencedPostings(state: ClientState): PostingReference[] {
    const dialog = state.reactionsDialog;
    if (!dialog?.show || dialog.postingId == null) {
        return [];
    }
    return [{
        nodeName: absoluteNodeName(dialog.nodeName, getRelNodeNameContext(state)),
        postingId: dialog.postingId
    }];
}
