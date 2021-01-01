export const WEB_PUSH_SUBSCRIBE = "WEB_PUSH_SUBSCRIBE";
export const webPushSubscribe = () => ({
    type: WEB_PUSH_SUBSCRIBE
});

export const WEB_PUSH_UNSUBSCRIBE = "WEB_PUSH_UNSUBSCRIBE";
export const webPushUnsubscribe = () => ({
    type: WEB_PUSH_UNSUBSCRIBE
});

export const WEB_PUSH_SUBSCRIPTION_SET = "WEB_PUSH_SUBSCRIPTION_SET";
export const webPushSubscriptionSet = (id) => ({
    type: WEB_PUSH_SUBSCRIPTION_SET,
    payload: {id}
});

export const WEB_PUSH_INVITATION_RESTORE = "WEB_PUSH_INVITATION_RESTORE";
export const webPushInvitationRestore = (stage, timestamp) => ({
    type: WEB_PUSH_INVITATION_RESTORE,
    payload: {stage, timestamp}
});

export const WEB_PUSH_INVITE = "WEB_PUSH_INVITE";
export const webPushInvite = () => ({
    type: WEB_PUSH_INVITE
});

export const WEB_PUSH_INVITATION_DECLINED = "WEB_PUSH_INVITATION_DECLINED";
export const webPushInvitationDeclined = () => ({
    type: WEB_PUSH_INVITATION_DECLINED
});
