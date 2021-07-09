import { ActionBase } from "state/action-base";
import { AvatarImage } from "api/node/api-types";

export const NODE_CARD_PREPARE = "NODE_CARD_PREPARE";
type NodeCardPrepareAction = ActionBase<typeof NODE_CARD_PREPARE, {
    nodeName: string;
}>;
export const nodeCardPrepare = (nodeName: string): NodeCardPrepareAction => ({
    type: NODE_CARD_PREPARE,
    payload: {nodeName}
});

export const NODE_CARD_LOAD = "NODE_CARD_LOAD";
type NodeCardLoadAction = ActionBase<typeof NODE_CARD_LOAD, {
    nodeName: string;
}>;
export const nodeCardLoad = (nodeName: string): NodeCardLoadAction => ({
    type: NODE_CARD_LOAD,
    payload: {nodeName}
});

export const NODE_CARD_LOADED = "NODE_CARD_LOADED";
type NodeCardLoadedAction = ActionBase<typeof NODE_CARD_LOADED, {
    nodeName: string;
}>;
export const nodeCardLoaded = (nodeName: string): NodeCardLoadedAction => ({
    type: NODE_CARD_LOADED,
    payload: {nodeName}
});

export const NODE_CARD_LOAD_FAILED = "NODE_CARD_LOAD_FAILED";
type NodeCardLoadFailedAction = ActionBase<typeof NODE_CARD_LOAD_FAILED, {
    nodeName: string;
}>;
export const nodeCardLoadFailed = (nodeName: string): NodeCardLoadFailedAction => ({
    type: NODE_CARD_LOAD_FAILED,
    payload: {nodeName}
});

export const NODE_CARD_DETAILS_SET = "NODE_CARD_DETAILS_SET";
type NodeCardDetailsSetAction = ActionBase<typeof NODE_CARD_DETAILS_SET, {
    nodeName: string;
    fullName: string | null;
    gender: string | null;
    title: string | null;
    avatar: AvatarImage | null;
}>;
export const nodeCardDetailsSet = (nodeName: string, fullName: string | null, gender: string | null,
                                   title: string | null, avatar: AvatarImage | null): NodeCardDetailsSetAction => ({
    type: NODE_CARD_DETAILS_SET,
    payload: {nodeName, fullName, gender, title, avatar}
});

export const NODE_CARD_PEOPLE_SET = "NODE_CARD_PEOPLE_SET";
type NodeCardPeopleSetAction = ActionBase<typeof NODE_CARD_PEOPLE_SET, {
    nodeName: string;
    subscribersTotal: number;
    subscriptionsTotal: number;
}>;
export const nodeCardPeopleSet = (nodeName: string, subscribersTotal: number,
                                  subscriptionsTotal: number): NodeCardPeopleSetAction => ({
    type: NODE_CARD_PEOPLE_SET,
    payload: {nodeName, subscribersTotal, subscriptionsTotal}
});

export const NODE_CARD_SUBSCRIPTION_SET = "NODE_CARD_SUBSCRIPTION_SET";
type NodeCardSubscriptionSetAction = ActionBase<typeof NODE_CARD_SUBSCRIPTION_SET, {
    nodeName: string;
    subscriberId: string;
}>;
export const nodeCardSubscriptionSet = (nodeName: string, subscriberId: string): NodeCardSubscriptionSetAction => ({
    type: NODE_CARD_SUBSCRIPTION_SET,
    payload: {nodeName, subscriberId}
});

export const NODE_CARDS_UNSET = "NODE_CARDS_UNSET";
type NodeCardsUnsetAction = ActionBase<typeof NODE_CARDS_UNSET, never>;
export const nodeCardsUnset = (): NodeCardsUnsetAction => ({
    type: NODE_CARDS_UNSET
});

export const NODE_CARD_COPY_MENTION = "NODE_CARD_COPY_MENTION";
type NodeCardCopyMentionAction = ActionBase<typeof NODE_CARD_COPY_MENTION, {
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
    | NodeCardPeopleSetAction
    | NodeCardSubscriptionSetAction
    | NodeCardsUnsetAction
    | NodeCardCopyMentionAction;
