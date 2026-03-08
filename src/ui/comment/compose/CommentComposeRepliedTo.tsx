import React from 'react';
import { useSelector } from 'react-redux';

import { commentRepliedToUnset } from "state/detailedposting/actions";
import {
    getCommentComposerRepliedToFullName,
    getCommentComposerRepliedToHeading,
    getCommentComposerRepliedToId,
    getCommentComposerRepliedToName,
    getDetailedPostingId
} from "state/detailedposting/selectors";
import { useDispatcher } from "ui/hook";
import RepliedTo from "ui/comment/RepliedTo";
import { htmlEntities, replaceEmojis } from "util/html";

interface Props {
    disabled?: boolean;
}

export default function CommentComposeRepliedTo({disabled}: Props) {
    const postingId = useSelector(getDetailedPostingId);
    const commentId = useSelector(getCommentComposerRepliedToId);
    const ownerName = useSelector(getCommentComposerRepliedToName);
    const ownerFullName = useSelector(getCommentComposerRepliedToFullName);
    const heading = useSelector(getCommentComposerRepliedToHeading);
    const dispatch = useDispatcher();

    const onUnset = () => dispatch(commentRepliedToUnset());

    if (postingId == null || commentId == null || ownerName == null) {
        return null;
    }

    return (
        <RepliedTo postingId={postingId} commentId={commentId} ownerName={ownerName} ownerFullName={ownerFullName}
                   headingHtml={replaceEmojis(htmlEntities(heading ?? ""))} disabled={disabled} unset={true}
                   onUnset={onUnset}/>
    );
}
