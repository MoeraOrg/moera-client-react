import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { commentRepliedToUnset } from "state/detailedposting/actions";
import {
    getCommentComposerRepliedToFullName,
    getCommentComposerRepliedToHeading,
    getCommentComposerRepliedToId,
    getCommentComposerRepliedToName,
    getDetailedPostingId
} from "state/detailedposting/selectors";
import RepliedTo from "ui/comment/RepliedTo";
import { htmlEntities, replaceEmojis } from "util/html";

export default function CommentComposeRepliedTo() {
    const postingId = useSelector(getDetailedPostingId);
    const commentId = useSelector(getCommentComposerRepliedToId);
    const ownerName = useSelector(getCommentComposerRepliedToName);
    const ownerFullName = useSelector(getCommentComposerRepliedToFullName);
    const heading = useSelector(getCommentComposerRepliedToHeading);
    const dispatch = useDispatch();

    const onUnset = () => dispatch(commentRepliedToUnset());

    if (postingId == null || commentId == null || ownerName == null) {
        return null;
    }

    return (
        <RepliedTo postingId={postingId} commentId={commentId} ownerName={ownerName} ownerFullName={ownerFullName}
                   headingHtml={replaceEmojis(htmlEntities(heading ?? ""))} unset={true} onUnset={onUnset}/>
    );
}
