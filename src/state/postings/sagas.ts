import i18n from 'i18next';

import { Node, ReactionTotalsInfo } from "api";
import { errorThrown } from "state/error/actions";
import { ClientAction } from "state/action";
import { dispatch, select } from "state/store-sagas";
import { homeIntroduced } from "state/init-barriers";
import { executor } from "state/executor";
import {
    EntryReactionAttributes,
    PostingCommentAddedBlockAction,
    postingCommentAddedBlocked,
    postingCommentAddedBlockFailed,
    PostingCommentAddedUnblockAction,
    postingCommentAddedUnblocked,
    postingCommentAddedUnblockFailed,
    PostingCommentsSubscribeAction,
    postingCommentsSubscribed,
    postingCommentsSubscribeFailed,
    PostingCommentsUnsubscribeAction,
    postingCommentsUnsubscribed,
    postingCommentsUnsubscribeFailed,
    PostingCopyLinkAction,
    PostingDeleteAction,
    postingDeleted,
    postingDeleteFailed,
    PostingLoadAction,
    postingLoadFailed,
    PostingOperationsUpdateAction,
    postingOperationsUpdated,
    PostingReactAction,
    PostingReactionDeleteAction,
    PostingReactionLoadAction,
    postingReactionSet,
    PostingReactionsReloadAction,
    postingSet,
    postingsReactionSet,
    PostingVerifyAction,
    postingVerifyFailed
} from "state/postings/actions";
import { WithContext } from "state/action-types";
import { flashBox } from "state/flashbox/actions";
import {
    getPosting,
    getPostingCommentAddedInstantBlockId,
    getPostingCommentsSubscriptionId
} from "state/postings/selectors";
import { getNodeRootLocation, getOwnerName } from "state/node/selectors";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { fillBlockedOperations } from "state/blockedoperations/sagas";
import { getNodeUri } from "state/naming/sagas";
import { fillSubscription } from "state/subscriptions/sagas";
import { isConnectedToHome } from "state/home/selectors";
import * as Browser from "ui/browser";
import { toAvatarDescription } from "util/avatar";
import { absoluteNodeName, REL_HOME, RelNodeName } from "util/rel-node-name";
import { clipboardCopy } from "util/clipboard";
import { notNull } from "util/misc";
import { universalLocation } from "util/universal-url";
import { ut } from "util/url";

export default [
    executor("POSTING_DELETE", payload => payload.id, postingDeleteSaga),
    executor("POSTING_LOAD", payload => payload.id, postingLoadSaga),
    executor("POSTING_VERIFY", payload => payload.id, postingVerifySaga),
    executor("POSTING_OPERATIONS_UPDATE", payload => payload.id, postingOperationsUpdateSaga),
    executor("POSTING_REACT", null, postingReactSaga),
    executor("POSTING_REACTION_LOAD", payload => payload.id, postingReactionLoadSaga),
    executor("POSTING_REACTIONS_RELOAD", "", postingReactionsReloadSaga),
    executor("POSTING_REACTION_DELETE", payload => payload.id, postingReactionDeleteSaga),
    executor("POSTING_COPY_LINK", payload => payload.id, postingCopyLinkSaga),
    executor("POSTING_COMMENTS_SUBSCRIBE", payload => payload.id, postingCommentsSubscribeSaga),
    executor("POSTING_COMMENTS_UNSUBSCRIBE", payload => payload.id, postingCommentsUnsubscribeSaga),
    executor("POSTING_COMMENT_ADDED_BLOCK", payload => payload.id, postingCommentAddedBlockSaga),
    executor("POSTING_COMMENT_ADDED_UNBLOCK", payload => payload.id, postingCommentAddedUnblockSaga)
];

async function postingDeleteSaga(action: WithContext<PostingDeleteAction>): Promise<void> {
    const {id, nodeName} = action.payload;
    const posting = getPosting(select(), id, nodeName);
    if (posting == null) {
        return;
    }
    try {
        await Node.deletePosting(action, nodeName, id);
        dispatch(postingDeleted(posting.id, posting.feedReferences ?? [], nodeName).causedBy(action));
    } catch (e) {
        dispatch(postingDeleteFailed(id, nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function postingLoadSaga(action: WithContext<PostingLoadAction>): Promise<void> {
    await homeIntroduced();
    const {id, nodeName} = action.payload;
    try {
        const posting = await Node.getPosting(action, nodeName, id, false, ["posting.not-found"]);
        await fillActivityReaction(action, posting);
        await fillBlockedOperations(action, posting);
        dispatch(postingSet(posting, nodeName).causedBy(action));
        await fillSubscription(action, posting);
    } catch (e) {
        dispatch(postingLoadFailed(id, nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function postingVerifySaga(action: WithContext<PostingVerifyAction>): Promise<void> {
    const {id, nodeName} = action.payload;
    const targetNodeName = absoluteNodeName(nodeName, action.context);
    try {
        await Node.verifyRemotePosting(action, REL_HOME, targetNodeName, id);
    } catch (e) {
        dispatch(postingVerifyFailed(id, nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function postingOperationsUpdateSaga(action: WithContext<PostingOperationsUpdateAction>): Promise<void> {
    const {id, nodeName, operations} = action.payload;
    try {
        let posting = select(state => getPosting(state, id, nodeName));
        if (posting == null) {
            return;
        }
        const originName = posting.receiverName ?? absoluteNodeName(nodeName, action.context);
        const originId = posting.receiverPostingId ?? id;
        posting = await Node.updatePosting(action, originName, originId, {operations});
        dispatch(postingOperationsUpdated(originId, originName, posting.operations ?? {}).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function postingReactSaga(action: WithContext<PostingReactAction>): Promise<void> {
    await homeIntroduced();
    const {id, negative, emoji, nodeName} = action.payload;
    const {ownerName, homeOwnerName, homeOwnerFullName, homeOwnerGender, homeOwnerAvatar} = action.context;
    try {
        const created = await Node.createPostingReaction(action, nodeName, id, {
            ownerName: homeOwnerName, ownerFullName: homeOwnerFullName, ownerGender: homeOwnerGender,
            ownerAvatar: toAvatarDescription(homeOwnerAvatar), negative, emoji
        });
        dispatch(postingReactionSet(id, {negative, emoji}, created.totals, nodeName).causedBy(action));
        const posting = select(state => getPosting(state, id, nodeName));
        if (ownerName != null && posting != null) {
            await Node.createRemotePostingReaction(
                action, REL_HOME,
                posting.receiverName ?? absoluteNodeName(nodeName, action.context), posting.receiverPostingId ?? id,
                {negative, emoji}
            );
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function postingReactionLoadSaga(action: WithContext<PostingReactionLoadAction>): Promise<void> {
    const {id, nodeName} = action.payload;
    const {homeOwnerName} = action.context;
    try {
        let reaction = null;
        if (homeOwnerName != null) {
            const {negative, emoji} = await Node.getPostingReaction(action, nodeName, id, homeOwnerName);
            reaction = negative != null && emoji != null ? {negative, emoji} : null;
        }
        const totals = await Node.getPostingReactionTotals(action, nodeName, id);
        dispatch(postingReactionSet(id, reaction, totals, nodeName).causedBy(action));
    } catch (e) {
        if (Browser.isDevMode()) {
            dispatch(errorThrown(e));
        }
    }
}

async function postingReactionsReloadSaga(action: WithContext<PostingReactionsReloadAction>): Promise<void> {
    const {homeOwnerName} = action.context;
    const {postingsState, connectedToHome} = select(state => ({
        postingsState: state.postings,
        connectedToHome: isConnectedToHome(state)
    }));
    for (const nodeName of Object.keys(postingsState)) {
        const ids = Object.keys(postingsState[nodeName] ?? {});
        if (connectedToHome) {
            const infos = await Node.searchPostingReactions(
                action, nodeName, {ownerName: homeOwnerName, postings: ids}
            );
            const reactions = infos
                .map(info => ({entryId: info.postingId, negative: info.negative, emoji: info.emoji}))
                .filter((attr): attr is EntryReactionAttributes => attr.negative != null && attr.emoji != null);
            const totals = await Node.searchPostingReactionTotals(action, nodeName, {postings: ids});
            dispatch(postingsReactionSet(reactions, totals, nodeName).causedBy(action));
        } else {
            const totals = ids
                .map(id => postingsState[nodeName]![id]!.posting.reactions)
                .filter(notNull);
            dispatch(postingsReactionSet([], totals, nodeName).causedBy(action))
        }
    }
}

async function postingReactionDeleteSaga(action: WithContext<PostingReactionDeleteAction>): Promise<void> {
    await homeIntroduced();
    let {id, nodeName} = action.payload;
    const {ownerName, homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    nodeName = absoluteNodeName(nodeName, action.context)

    try {
        const posting = select(state => getPosting(state, id, nodeName));
        if (ownerName == null || posting == null) {
            return;
        }

        let totals: ReactionTotalsInfo = {entryId: id, positive: [], negative: []};
        if ((posting.receiverName == null && posting.receiverPostingId == null) || nodeName === homeOwnerName) {
            totals = await Node.deletePostingReaction(action, nodeName, id, homeOwnerName);
        }
        if (posting.receiverName != null && posting.receiverPostingId != null) {
            totals = await Node.deletePostingReaction(
                action, posting.receiverName, posting.receiverPostingId, homeOwnerName
            );
        }
        dispatch(postingReactionSet(id, null, totals, nodeName).causedBy(action));
        await Node.deleteRemotePostingReaction(
            action, REL_HOME, posting.receiverName ?? nodeName, posting.receiverPostingId ?? id
        );
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

export async function postingGetLink(
    action: WithContext<ClientAction>, id: string, nodeName: RelNodeName | string
): Promise<string> {
    const posting = getPosting(select(), id, nodeName);
    const targetNode = posting?.receiverName ?? absoluteNodeName(nodeName, action.context);
    if (targetNode && posting?.receiverDeletedAt == null) {
        const nodeUri = await getNodeUri(action, targetNode);
        return universalLocation(null, targetNode, nodeUri, ut`/post/${posting?.receiverPostingId ?? id}`);
    } else {
        const {ownerName, rootLocation} = select(state => ({
            ownerName: getOwnerName(state),
            rootLocation: getNodeRootLocation(state)
        }));
        return universalLocation(null, ownerName, rootLocation, ut`/moera/post/${id}`);
    }
}

async function postingCopyLinkSaga(action: WithContext<PostingCopyLinkAction>): Promise<void> {
    const {id, nodeName} = action.payload;
    try {
        const href = await postingGetLink(action, id, nodeName);
        await clipboardCopy(href);
        if (!Browser.isAndroidBrowser()) {
            dispatch(flashBox(i18n.t("link-copied")).causedBy(action));
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function postingCommentsSubscribeSaga(action: WithContext<PostingCommentsSubscribeAction>): Promise<void> {
    await homeIntroduced();
    const {id, nodeName} = action.payload;
    const {posting, ownerName} = select(state => ({
        posting: getPosting(state, id, nodeName),
        ownerName: getOwnerName(state)
    }));
    if (posting == null || ownerName == null) {
        dispatch(postingCommentsSubscribeFailed(id, nodeName).causedBy(action));
        return;
    }
    const remoteNodeName = posting.receiverName ?? absoluteNodeName(nodeName, action.context);
    const remotePostingId = posting.receiverPostingId ?? id;
    try {
        const subscription = await Node.createSubscription(
            action, REL_HOME, {type: "posting-comments" as const, remoteNodeName, remotePostingId}
        );
        dispatch(postingCommentsSubscribed(id, subscription.id, nodeName).causedBy(action));
    } catch (e) {
        dispatch(postingCommentsSubscribeFailed(id, nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function postingCommentsUnsubscribeSaga(action: WithContext<PostingCommentsUnsubscribeAction>): Promise<void> {
    await homeIntroduced();
    const {id, nodeName} = action.payload;
    const {posting, ownerName, subscriptionId} = select(state => ({
        posting: getPosting(state, id, nodeName),
        ownerName: getOwnerName(state),
        subscriptionId: getPostingCommentsSubscriptionId(state, id, nodeName)
    }));
    if (posting == null || ownerName == null) {
        dispatch(postingCommentsUnsubscribeFailed(id, nodeName).causedBy(action));
        return;
    }
    try {
        if (subscriptionId != null) {
            await Node.deleteSubscription(action, REL_HOME, subscriptionId);
        }
        dispatch(postingCommentsUnsubscribed(id, nodeName).causedBy(action));
    } catch (e) {
        dispatch(postingCommentsUnsubscribeFailed(id, nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function postingCommentAddedBlockSaga(action: WithContext<PostingCommentAddedBlockAction>): Promise<void> {
    await homeIntroduced();
    const {id, nodeName} = action.payload;
    const posting = getPosting(select(), id, nodeName);
    if (posting == null) {
        dispatch(postingCommentAddedBlockFailed(id, nodeName).causedBy(action));
        return;
    }
    const postingId = posting.receiverPostingId ?? id;
    try {
        const blockedInstant = await Node.blockInstant(
            action, REL_HOME, {storyType: "comment-added" as const, entryId: postingId}
        );
        dispatch(postingCommentAddedBlocked(id, blockedInstant.id, nodeName).causedBy(action));
    } catch (e) {
        dispatch(postingCommentAddedBlockFailed(id, nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function postingCommentAddedUnblockSaga(action: WithContext<PostingCommentAddedUnblockAction>): Promise<void> {
    await homeIntroduced();
    const {id, nodeName} = action.payload;
    const {posting, instantBlockId} = select(state => ({
        posting: getPosting(state, id, nodeName),
        instantBlockId: getPostingCommentAddedInstantBlockId(state, id, nodeName)
    }));
    if (posting == null) {
        dispatch(postingCommentAddedUnblockFailed(id, nodeName).causedBy(action));
        return;
    }
    try {
        if (instantBlockId != null) {
            await Node.unblockInstant(action, REL_HOME, instantBlockId);
        }
        dispatch(postingCommentAddedUnblocked(id, nodeName).causedBy(action));
    } catch (e) {
        dispatch(postingCommentAddedUnblockFailed(id, nodeName).causedBy(action));
        dispatch(errorThrown(e));
    }
}
