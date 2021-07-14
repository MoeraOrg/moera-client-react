import { ClientState } from "state/state";
import { NodeCardState } from "state/nodecards/state";

export function getNodeCard(state: ClientState, nodeName: string): NodeCardState {
    return state.nodeCards[nodeName];
}

export function isNodeCardToBeLoaded(state: ClientState, nodeName: string): boolean {
    const nodeCard = getNodeCard(state, nodeName);
    return nodeCard == null || (!nodeCard.loaded && !nodeCard.loading);
}
