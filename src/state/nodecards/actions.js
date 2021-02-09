export const NODE_CARD_PREPARE = "NODE_CARD_PREPARE";
export const nodeCardPrepare = (nodeName) => ({
    type: NODE_CARD_PREPARE,
    payload: {nodeName}
});

export const NODE_CARD_LOAD = "NODE_CARD_LOAD";
export const nodeCardLoad = (nodeName) => ({
    type: NODE_CARD_LOAD,
    payload: {nodeName}
});

export const NODE_CARD_LOADED = "NODE_CARD_LOADED";
export const nodeCardLoaded = (nodeName) => ({
    type: NODE_CARD_LOADED,
    payload: {nodeName}
});

export const NODE_CARD_LOAD_FAILED = "NODE_CARD_LOAD_FAILED";
export const nodeCardLoadFailed = (nodeName) => ({
    type: NODE_CARD_LOAD_FAILED,
    payload: {nodeName}
});

export const NODE_CARD_PEOPLE_SET = "NODE_CARD_PEOPLE_SET";
export const nodeCardPeopleSet = (nodeName, subscribersTotal, subscriptionsTotal) => ({
    type: NODE_CARD_PEOPLE_SET,
    payload: {nodeName, subscribersTotal, subscriptionsTotal}
});