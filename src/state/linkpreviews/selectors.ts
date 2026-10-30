import { ClientState } from "state/state";
import { ExtLinkPreviewInfo } from "state/linkpreviews/state";

export function getLinkPreviewInfo(state: ClientState, url: string): ExtLinkPreviewInfo | null {
    return state.linkPreviews[url]?.info ?? null;
}
