import { ClientState } from "state/state";
import { NodeCardState } from "state/nodecards/state";

export function getNodeCard(state: ClientState, nodeName: string): NodeCardState | null {
    return state.nodeCards[nodeName] ?? null;
}

export function isNodeCardCached(state: ClientState, nodeName: string): boolean {
    return getNodeCard(state, nodeName) != null;
}

export function isNodeCardToBeLoaded(state: ClientState, nodeName: string): boolean {
    const nodeCard = getNodeCard(state, nodeName);
    return nodeCard == null || (!nodeCard.loaded && !nodeCard.loading);
}
