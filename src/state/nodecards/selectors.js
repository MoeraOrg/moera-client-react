export function getNodeCard(state, nodeName) {
    return state.nodeCards[nodeName];
}

export function isNodeCardToBeLoaded(state, nodeName) {
    const nodeCard = getNodeCard(state, nodeName);
    return nodeCard == null || (!nodeCard.loaded && !nodeCard.loading);
}
