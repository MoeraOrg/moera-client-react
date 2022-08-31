import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { ProfileInfo, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

export const NODE_CARD_PREPARE = "NODE_CARD_PREPARE";
export type NodeCardPrepareAction = ActionWithPayload<typeof NODE_CARD_PREPARE, {
    nodeName: string;
}>;
export const nodeCardPrepare = (nodeName: string): NodeCardPrepareAction => ({
    type: NODE_CARD_PREPARE,
    payload: {nodeName}
});

export const NODE_CARD_DETAILS_LOAD = "NODE_CARD_DETAILS_LOAD";
export type NodeCardDetailsLoadAction = ActionWithPayload<typeof NODE_CARD_DETAILS_LOAD, {
    nodeName: string;
}>;
export const nodeCardDetailsLoad = (nodeName: string): NodeCardDetailsLoadAction => ({
    type: NODE_CARD_DETAILS_LOAD,
    payload: {nodeName}
});

export const NODE_CARD_DETAILS_LOAD_FAILED = "NODE_CARD_DETAILS_LOAD_FAILED";
export type NodeCardDetailsLoadFailedAction = ActionWithPayload<typeof NODE_CARD_DETAILS_LOAD_FAILED, {
    nodeName: string;
}>;
export const nodeCardDetailsLoadFailed = (nodeName: string): NodeCardDetailsLoadFailedAction => ({
    type: NODE_CARD_DETAILS_LOAD_FAILED,
    payload: {nodeName}
});

export const NODE_CARD_DETAILS_SET = "NODE_CARD_DETAILS_SET";
export type NodeCardDetailsSetAction = ActionWithPayload<typeof NODE_CARD_DETAILS_SET, {
    nodeName: string;
    profile: ProfileInfo
}>;
export const nodeCardDetailsSet = (nodeName: string, profile: ProfileInfo): NodeCardDetailsSetAction => ({
    type: NODE_CARD_DETAILS_SET,
    payload: {nodeName, profile}
});

export const NODE_CARD_STORIES_LOAD = "NODE_CARD_STORIES_LOAD";
export type NodeCardStoriesLoadAction = ActionWithPayload<typeof NODE_CARD_STORIES_LOAD, {
    nodeName: string;
}>;
export const nodeCardStoriesLoad = (nodeName: string): NodeCardStoriesLoadAction => ({
    type: NODE_CARD_STORIES_LOAD,
    payload: {nodeName}
});

export const NODE_CARD_STORIES_LOAD_FAILED = "NODE_CARD_STORIES_LOAD_FAILED";
export type NodeCardStoriesLoadFailedAction = ActionWithPayload<typeof NODE_CARD_STORIES_LOAD_FAILED, {
    nodeName: string;
}>;
export const nodeCardStoriesLoadFailed = (nodeName: string): NodeCardStoriesLoadFailedAction => ({
    type: NODE_CARD_STORIES_LOAD_FAILED,
    payload: {nodeName}
});

export const NODE_CARD_STORIES_SET = "NODE_CARD_STORIES_SET";
export type NodeCardStoriesSetAction = ActionWithPayload<typeof NODE_CARD_STORIES_SET, {
    nodeName: string;
    storiesTotal: number;
    lastStoryCreatedAt: number | null;
}>;
export const nodeCardStoriesSet = (nodeName: string, storiesTotal: number,
                                   lastStoryCreatedAt: number | null): NodeCardStoriesSetAction => ({
    type: NODE_CARD_STORIES_SET,
    payload: {nodeName, storiesTotal, lastStoryCreatedAt}
});

export const NODE_CARD_PEOPLE_LOAD = "NODE_CARD_PEOPLE_LOAD";
export type NodeCardPeopleLoadAction = ActionWithPayload<typeof NODE_CARD_PEOPLE_LOAD, {
    nodeName: string;
}>;
export const nodeCardPeopleLoad = (nodeName: string): NodeCardPeopleLoadAction => ({
    type: NODE_CARD_PEOPLE_LOAD,
    payload: {nodeName}
});

export const NODE_CARD_PEOPLE_LOAD_FAILED = "NODE_CARD_PEOPLE_LOAD_FAILED";
export type NodeCardPeopleLoadFailedAction = ActionWithPayload<typeof NODE_CARD_PEOPLE_LOAD_FAILED, {
    nodeName: string;
}>;
export const nodeCardPeopleLoadFailed = (nodeName: string): NodeCardPeopleLoadFailedAction => ({
    type: NODE_CARD_PEOPLE_LOAD_FAILED,
    payload: {nodeName}
});

export const NODE_CARD_PEOPLE_SET = "NODE_CARD_PEOPLE_SET";
export type NodeCardPeopleSetAction = ActionWithPayload<typeof NODE_CARD_PEOPLE_SET, {
    nodeName: string;
    subscribersTotal: number | null;
    subscriptionsTotal: number | null;
}>;
export const nodeCardPeopleSet = (nodeName: string, subscribersTotal: number | null,
                                  subscriptionsTotal: number | null): NodeCardPeopleSetAction => ({
    type: NODE_CARD_PEOPLE_SET,
    payload: {nodeName, subscribersTotal, subscriptionsTotal}
});

export const NODE_CARD_SUBSCRIPTION_LOAD = "NODE_CARD_SUBSCRIPTION_LOAD";
export type NodeCardSubscriptionLoadAction = ActionWithPayload<typeof NODE_CARD_SUBSCRIPTION_LOAD, {
    nodeName: string;
}>;
export const nodeCardSubscriptionLoad = (nodeName: string): NodeCardSubscriptionLoadAction => ({
    type: NODE_CARD_SUBSCRIPTION_LOAD,
    payload: {nodeName}
});

export const NODE_CARD_SUBSCRIPTION_LOAD_FAILED = "NODE_CARD_SUBSCRIPTION_LOAD_FAILED";
export type NodeCardSubscriptionLoadFailedAction = ActionWithPayload<typeof NODE_CARD_SUBSCRIPTION_LOAD_FAILED, {
    nodeName: string;
}>;
export const nodeCardSubscriptionLoadFailed = (nodeName: string): NodeCardSubscriptionLoadFailedAction => ({
    type: NODE_CARD_SUBSCRIPTION_LOAD_FAILED,
    payload: {nodeName}
});

export const NODE_CARD_SUBSCRIPTION_SET = "NODE_CARD_SUBSCRIPTION_SET";
export type NodeCardSubscriptionSetAction = ActionWithPayload<typeof NODE_CARD_SUBSCRIPTION_SET, {
    nodeName: string;
    subscriber: SubscriberInfo | null;
    subscription: SubscriptionInfo | null;
}>;
export const nodeCardSubscriptionSet = (nodeName: string,
                                        subscriber: SubscriberInfo | null,
                                        subscription: SubscriptionInfo | null): NodeCardSubscriptionSetAction => ({
    type: NODE_CARD_SUBSCRIPTION_SET,
    payload: {nodeName, subscriber, subscription}
});

export const NODE_CARDS_UNSET = "NODE_CARDS_UNSET";
export type NodeCardsUnsetAction = Action<typeof NODE_CARDS_UNSET>;
export const nodeCardsUnset = (): NodeCardsUnsetAction => ({
    type: NODE_CARDS_UNSET
});

export const NODE_CARD_COPY_MENTION = "NODE_CARD_COPY_MENTION";
export type NodeCardCopyMentionAction = ActionWithPayload<typeof NODE_CARD_COPY_MENTION, {
    nodeName: string;
    fullName: string | null;
}>;
export const nodeCardCopyMention = (nodeName: string, fullName: string | null): NodeCardCopyMentionAction => ({
    type: NODE_CARD_COPY_MENTION,
    payload: {nodeName, fullName}
});

export type NodeCardsAnyAction =
    NodeCardPrepareAction
    | NodeCardDetailsLoadAction
    | NodeCardDetailsLoadFailedAction
    | NodeCardDetailsSetAction
    | NodeCardStoriesLoadAction
    | NodeCardStoriesLoadFailedAction
    | NodeCardStoriesSetAction
    | NodeCardPeopleLoadAction
    | NodeCardPeopleLoadFailedAction
    | NodeCardPeopleSetAction
    | NodeCardSubscriptionLoadAction
    | NodeCardSubscriptionLoadFailedAction
    | NodeCardSubscriptionSetAction
    | NodeCardsUnsetAction
    | NodeCardCopyMentionAction;
