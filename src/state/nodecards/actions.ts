import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { AvatarImage, FundraiserInfo } from "api/node/api-types";

export const NODE_CARD_PREPARE = "NODE_CARD_PREPARE";
export type NodeCardPrepareAction = ActionWithPayload<typeof NODE_CARD_PREPARE, {
    nodeName: string;
}>;
export const nodeCardPrepare = (nodeName: string): NodeCardPrepareAction => ({
    type: NODE_CARD_PREPARE,
    payload: {nodeName}
});

export const NODE_CARD_LOAD = "NODE_CARD_LOAD";
export type NodeCardLoadAction = ActionWithPayload<typeof NODE_CARD_LOAD, {
    nodeName: string;
}>;
export const nodeCardLoad = (nodeName: string): NodeCardLoadAction => ({
    type: NODE_CARD_LOAD,
    payload: {nodeName}
});

export const NODE_CARD_LOADED = "NODE_CARD_LOADED";
export type NodeCardLoadedAction = ActionWithPayload<typeof NODE_CARD_LOADED, {
    nodeName: string;
}>;
export const nodeCardLoaded = (nodeName: string): NodeCardLoadedAction => ({
    type: NODE_CARD_LOADED,
    payload: {nodeName}
});

export const NODE_CARD_LOAD_FAILED = "NODE_CARD_LOAD_FAILED";
export type NodeCardLoadFailedAction = ActionWithPayload<typeof NODE_CARD_LOAD_FAILED, {
    nodeName: string;
}>;
export const nodeCardLoadFailed = (nodeName: string): NodeCardLoadFailedAction => ({
    type: NODE_CARD_LOAD_FAILED,
    payload: {nodeName}
});

export const NODE_CARD_DETAILS_SET = "NODE_CARD_DETAILS_SET";
export type NodeCardDetailsSetAction = ActionWithPayload<typeof NODE_CARD_DETAILS_SET, {
    nodeName: string;
    fullName: string | null;
    gender: string | null;
    title: string | null;
    avatar: AvatarImage | null;
    fundraisers: FundraiserInfo[] | null;
}>;
export const nodeCardDetailsSet = (nodeName: string, fullName: string | null, gender: string | null,
                                   title: string | null, avatar: AvatarImage | null,
                                   fundraisers: FundraiserInfo[] | null): NodeCardDetailsSetAction => ({
    type: NODE_CARD_DETAILS_SET,
    payload: {nodeName, fullName, gender, title, avatar, fundraisers}
});

export const NODE_CARD_STORIES_SET = "NODE_CARD_STORIESSET";
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

export const NODE_CARD_SUBSCRIPTION_SET = "NODE_CARD_SUBSCRIPTION_SET";
export type NodeCardSubscriptionSetAction = ActionWithPayload<typeof NODE_CARD_SUBSCRIPTION_SET, {
    nodeName: string;
    subscriberId: string | null;
}>;
export const nodeCardSubscriptionSet = (nodeName: string,
                                        subscriberId: string | null): NodeCardSubscriptionSetAction => ({
    type: NODE_CARD_SUBSCRIPTION_SET,
    payload: {nodeName, subscriberId}
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
    | NodeCardLoadAction
    | NodeCardLoadedAction
    | NodeCardLoadFailedAction
    | NodeCardDetailsSetAction
    | NodeCardStoriesSetAction
    | NodeCardPeopleSetAction
    | NodeCardSubscriptionSetAction
    | NodeCardsUnsetAction
    | NodeCardCopyMentionAction;
