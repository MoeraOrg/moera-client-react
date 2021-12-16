import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';

import { CommentText, DraftText, SourceFormat } from "api/node/api-types";
import { getOwnerName } from "state/owner/selectors";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { getHomeOwnerFullName } from "state/home/selectors";
import {
    getCommentComposerRepliedToId,
    getCommentDialogComment,
    getCommentsState
} from "state/detailedposting/selectors";
import { commentDraftSave } from "state/detailedposting/actions";
import { RichTextMedia } from "state/richtexteditor/actions";
import { DraftSaver } from "ui/control";
import commentComposeLogic, { CommentComposeValues } from "ui/comment/comment-compose-logic";

interface OwnProps {
    initialText: CommentText;
    commentId: string | null;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const commentDraftSaverLogic = {

    toText: (values: CommentComposeValues, props: Props): CommentText | null =>
        commentComposeLogic.mapValuesToCommentText(values, props),

    isEmpty: (commentText: CommentText): boolean =>
        commentComposeLogic.isCommentTextEmpty(commentText),

    toDraftText: (ownerName: string, postingId: string, commentId: string | null,
                  commentText: CommentText, media: Map<string, RichTextMedia>): DraftText => ({
        ...cloneDeep(commentText),
        media: commentText.media?.map(id => ({
            id,
            hash: media.get(id)?.hash,
            digest: media.get(id)?.digest
        })),
        receiverName: ownerName,
        draftType: commentId == null ? "new-comment" : "comment-update",
        receiverPostingId: postingId,
        receiverCommentId: commentId ?? null /* important, should not be undefined */
    } as DraftText),

    save: (text: CommentText, values: CommentComposeValues, props: Props): void => {
        if (props.ownerName != null && props.receiverPostingId != null) {
            const media = new Map(
                (values.body.media ?? [])
                    .filter((rm): rm is RichTextMedia => rm != null)
                    .map(rm => [rm.id, rm])
            );
            props.commentDraftSave(props.draft?.id ?? null,
                commentDraftSaverLogic.toDraftText(props.ownerName, props.receiverPostingId, props.commentId,
                    text, media));
        }
    }

}

const ComposeDraftSaver = (props: Props) => (
    <DraftSaver logic={commentDraftSaverLogic} {...props}/>
);

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        ownerName: getOwnerName(state),
        ownerFullName: getHomeOwnerFullName(state),
        receiverPostingId: getCommentsState(state).receiverPostingId,
        repliedToId: ownProps.commentId == null
            ? getCommentComposerRepliedToId(state)
            : getCommentDialogComment(state)?.repliedTo?.id ?? null,
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
    { commentDraftSave }
);

export default connector(ComposeDraftSaver);
