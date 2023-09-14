import { ClientState } from "state/state";
import { LinkPreviewInfo } from "api";

export function getLinkPreviewInfo(state: ClientState, url: string): LinkPreviewInfo | null {
    return state.linkPreviews[url]?.info ?? null;
}
