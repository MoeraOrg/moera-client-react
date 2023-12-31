import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { commentReact, commentReactionDelete } from "state/detailedposting/actions";
import { getCommentsReceiverPostingId } from "state/detailedposting/selectors";
import { ReactionButton } from "ui/control";
import "./CommentButton.css";

interface Props {
    icon: IconProp;
    caption: string;
    invisible: boolean;
    id: string;
    negative: boolean;
    emoji: number | null;
    accepted: string;
}

export default function CommentReactionButton({icon, caption, invisible, id, negative, emoji, accepted}: Props) {
    const postingId = useSelector(getCommentsReceiverPostingId);
    const dispatch = useDispatch();

    if (postingId == null) {
        return null;
    }

    const onReactionAdd = (negative: boolean, emoji: number) => dispatch(commentReact(id, negative, emoji));
    const onReactionDelete = () => dispatch(commentReactionDelete(id, postingId));

    return (
        <ReactionButton icon={icon} emoji={emoji} caption={caption} className="comment-button" negative={negative}
                        accepted={accepted} invisible={invisible} onReactionAdd={onReactionAdd}
                        onReactionDelete={onReactionDelete}/>
    );
}
