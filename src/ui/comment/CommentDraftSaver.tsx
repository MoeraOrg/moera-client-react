import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';

import { CommentText, DraftText, SourceFormat } from "api/node/api-types";
import { VerifiedMediaFile } from "api/node/images-upload";
import { getOwnerName } from "state/owner/selectors";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { getHomeOwnerFullName } from "state/home/selectors";
import {
    getCommentComposerRepliedToId,
    getCommentDialogComment,
    getCommentsState
} from "state/detailedposting/selectors";
import { commentDialogCommentReset, commentDraftDelete, commentDraftSave } from "state/detailedposting/actions";
import { DraftSaver } from "ui/control";
import commentComposeLogic, { CommentComposeValues } from "ui/comment/comment-compose-logic";

interface OwnProps {
    initialized: boolean;
    initialText: CommentText;
    commentId: string | null;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const toDraftText = (receiverName: string, postingId: string, commentId: string | null, repliedToId: string | null,
                     commentText: CommentText, media: Map<string, VerifiedMediaFile>): DraftText => ({
    ...cloneDeep(commentText),
    media: commentText.media?.map(id => ({
        id,
        hash: media.get(id)?.hash,
        digest: media.get(id)?.digest
    })),
    receiverName,
    draftType: commentId == null ? "new-comment" : "comment-update",
    receiverPostingId: postingId,
    receiverCommentId: commentId ?? null, /* important, should not be undefined */
    repliedToId
} as DraftText);

const ComposeDraftSaver = (props: Props) => {
    const {
        initialized, initialText, savingDraft, savedDraft, ownerName, receiverName, receiverPostingId, commentId,
        repliedToId, comment, draft, commentDraftSave, commentDraftDelete, commentDialogCommentReset
    } = props;

    const toText = (values: CommentComposeValues): CommentText | null =>
        commentComposeLogic.mapValuesToCommentText(values, props);

    const isChanged = (commentText: CommentText): boolean =>
        commentComposeLogic.isCommentTextChanged(commentText, comment);

    const save = (text: CommentText, values: CommentComposeValues): void => {
        if (ownerName != null && receiverPostingId != null) {
            const media = new Map(
                (values.body.media ?? [])
                    .concat(values.linkPreviews.media)
                    .filter((rm): rm is VerifiedMediaFile => rm != null)
                    .map(rm => [rm.id, rm])
            );
            commentDraftSave(draft?.id ?? null,
                toDraftText(receiverName ?? ownerName, receiverPostingId, commentId, repliedToId, text, media));
        }
    };

    const drop = (): void => {
        if (commentId != null) {
            if (draft?.id != null) {
                commentDialogCommentReset(draft.id, false);
            }
        } else {
            commentDraftDelete();
        }
    }

    return (
        <DraftSaver initialized={initialized} initialText={initialText} savingDraft={savingDraft}
                    savedDraft={savedDraft} toText={toText} isChanged={isChanged} save={save} drop={drop}/>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        ownerName: getOwnerName(state),
        ownerFullName: getHomeOwnerFullName(state),
        receiverName: getCommentsState(state).receiverName,
        receiverPostingId: getCommentsState(state).receiverPostingId,
        repliedToId: ownProps.commentId == null
            ? getCommentComposerRepliedToId(state)
            : getCommentDialogComment(state)?.repliedTo?.id ?? null,
        comment: ownProps.commentId != null ? state.detailedPosting.commentDialog.comment : null,
        draft: ownProps.commentId == null
            ? state.detailedPosting.compose.draft
            : state.detailedPosting.commentDialog.draft,
        savingDraft: ownProps.commentId == null
            ? state.detailedPosting.compose.savingDraft
            : state.detailedPosting.commentDialog.savingDraft,
        savedDraft: ownProps.commentId == null
            ? state.detailedPosting.compose.savedDraft
            : state.detailedPosting.commentDialog.savedDraft,
        smileysEnabled: getSetting(state, "comment.smileys.enabled") as boolean,
        reactionsPositiveDefault: getSetting(state, "comment.reactions.positive.default") as string,
        reactionsNegativeDefault: getSetting(state, "comment.reactions.negative.default") as string,
        sourceFormatDefault: getSetting(state, "comment.body-src-format.default") as SourceFormat
    }),
    { commentDraftSave, commentDraftDelete, commentDialogCommentReset }
);

export default connector(ComposeDraftSaver);
