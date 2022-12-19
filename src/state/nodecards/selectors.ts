import { ClientState } from "state/state";
import { NodeCardState } from "state/nodecards/state";

export function getNodeCard(state: ClientState, nodeName: string | null | undefined): NodeCardState | null {
    return nodeName != null ? state.nodeCards.cards[nodeName] ?? null : null;
}

export function isNodeCardDetailsLoaded(state: ClientState, nodeName: string): boolean {
    const card = getNodeCard(state, nodeName);
    return card != null && card.details.loaded;
}

export function isNodeCardAnyLoaded(state: ClientState, nodeName: string): boolean {
    const card = getNodeCard(state, nodeName);
    return card != null
        && (card.details.loaded || card.stories.loaded || card.people.loaded || card.subscription.loaded);
}

export function isNodeCardAnyLoading(state: ClientState, nodeName: string): boolean {
    const card = getNodeCard(state, nodeName);
    return card != null
        && (card.details.loading || card.stories.loading || card.people.loading || card.subscription.loading);
}
