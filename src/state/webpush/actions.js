export const WEB_PUSH_SUBSCRIBE = "WEB_PUSH_SUBSCRIBE";
export const webPushSubscribe = () => ({
    type: WEB_PUSH_SUBSCRIBE
});

export const WEB_PUSH_SUBSCRIPTION_SET = "WEB_PUSH_SUBSCRIPTION_SET";
export const webPushSubscriptionSet = (id) => ({
    type: WEB_PUSH_SUBSCRIPTION_SET,
    payload: {id}
});
