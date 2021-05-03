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

export const NODE_CARD_DETAILS_SET = "NODE_CARD_DETAILS_SET";
export const nodeCardDetailsSet = (nodeName, fullName, gender, title, avatar) => ({
    type: NODE_CARD_DETAILS_SET,
    payload: {nodeName, fullName, gender, title, avatar}
});

export const NODE_CARD_PEOPLE_SET = "NODE_CARD_PEOPLE_SET";
export const nodeCardPeopleSet = (nodeName, subscribersTotal, subscriptionsTotal) => ({
    type: NODE_CARD_PEOPLE_SET,
    payload: {nodeName, subscribersTotal, subscriptionsTotal}
});

export const NODE_CARD_SUBSCRIPTION_SET = "NODE_CARD_SUBSCRIPTION_SET";
export const nodeCardSubscriptionSet = (nodeName, subscriberId) => ({
    type: NODE_CARD_SUBSCRIPTION_SET,
    payload: {nodeName, subscriberId}
});

export const NODE_CARDS_UNSET = "NODE_CARDS_UNSET";
export const nodeCardsUnset = () => ({
    type: NODE_CARDS_UNSET
});
