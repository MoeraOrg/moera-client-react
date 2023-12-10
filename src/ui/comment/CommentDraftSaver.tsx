import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';

import { CommentText, DraftText, SourceFormat, VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { getOwnerName } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { getHomeOwnerFullName, getHomeOwnerGender } from "state/home/selectors";
import {
    getCommentComposerRepliedToId,
    getCommentDialogComment,
    getCommentsState
} from "state/detailedposting/selectors";
import { commentDialogCommentReset, commentDraftDelete, commentDraftSave } from "state/detailedposting/actions";
import { DraftSaver } from "ui/control";
import { CommentComposeValues, isCommentTextChanged, valuesToCommentText } from "ui/comment/comment-compose";

interface Props {
    commentId: string | null;
}

const toDraftText = (
    receiverName: string, postingId: string, commentId: string | null, repliedToId: string | null,
    commentText: CommentText, media: Map<string, VerifiedMediaFile>
): DraftText => ({
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

export default function CommentDraftSaver({commentId}: Props) {
    const ownerName = useSelector(getOwnerName);
    const ownerFullName = useSelector(getHomeOwnerFullName);
    const ownerGender = useSelector(getHomeOwnerGender);
    const receiverName = useSelector((state: ClientState) => getCommentsState(state).receiverName);
    const receiverPostingId = useSelector((state: ClientState) => getCommentsState(state).receiverPostingId);
    const repliedToId = useSelector(
        (state: ClientState) =>
            commentId == null
                ? getCommentComposerRepliedToId(state)
                : getCommentDialogComment(state)?.repliedTo?.id ?? null
    );
    const comment = useSelector((state: ClientState) =>
        commentId != null ? state.detailedPosting.commentDialog.comment : null);
    const formId = useSelector((state: ClientState) => commentId != null ? null : state.detailedPosting.compose.formId);
    const draft = useSelector((state: ClientState) =>
        commentId == null ? state.detailedPosting.compose.draft : state.detailedPosting.commentDialog.draft);
    const smileysEnabled = useSelector((state: ClientState) => getSetting(state, "comment.smileys.enabled") as boolean);
    const reactionsPositiveDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions.positive.default") as string);
    const reactionsNegativeDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions.negative.default") as string);
    const sourceFormatDefault = useSelector((state: ClientState) =>
        getSetting(state, "comment.body-src-format.default") as SourceFormat);
    const dispatch = useDispatch();

    const toText = (values: CommentComposeValues): CommentText | null =>
        valuesToCommentText(
            values,
            {
                ownerName, ownerFullName, ownerGender, smileysEnabled, sourceFormatDefault, reactionsPositiveDefault,
                reactionsNegativeDefault, repliedToId
            }
        );

    const isChanged = (commentText: CommentText): boolean => isCommentTextChanged(commentText, comment);

    const save = (text: CommentText, values: CommentComposeValues): void => {
        if (ownerName != null && receiverPostingId != null) {
            const media = new Map(
                (values.body.media ?? [])
                    .concat(values.linkPreviews.media)
                    .filter((rm): rm is VerifiedMediaFile => rm != null)
                    .map(rm => [rm.id, rm])
            );
            dispatch(commentDraftSave(
                draft?.id ?? null,
                toDraftText(receiverName ?? ownerName, receiverPostingId, commentId, repliedToId, text, media),
                formId
            ));
        }
    };

    const drop = (): void => {
        if (commentId != null) {
            if (draft?.id != null) {
                dispatch(commentDialogCommentReset(draft.id, false));
            }
        } else {
            if (draft != null) {
                dispatch(commentDraftDelete(draft));
            }
        }
    }

    return (
        <DraftSaver toText={toText} isChanged={isChanged} save={save} drop={drop}
                    savingDraftSelector={
                         (state: ClientState) =>
                             commentId == null
                                 ? state.detailedPosting.compose.savingDraft
                                 : state.detailedPosting.commentDialog.savingDraft
                     }
                    savedDraftSelector={
                         (state: ClientState) =>
                             commentId == null
                                 ? state.detailedPosting.compose.savedDraft
                                 : state.detailedPosting.commentDialog.savedDraft}/>
    );
}
