import React from 'react';
import { useDispatch } from 'react-redux';
import { IconName } from '@fortawesome/free-regular-svg-icons';

import { postingReact, postingReactionDelete } from "state/postings/actions";
import { ReactionButton } from "ui/control";
import "./PostingButton.css";

interface Props {
    icon: IconName;
    caption: string;
    invisible: boolean;
    id: string;
    negative: boolean;
    emoji: number | null;
    accepted: string;
}

export default function PostingReactionButton({icon, caption, invisible, id, negative, emoji, accepted}: Props) {
    const dispatch = useDispatch();

    return (
        <ReactionButton icon={icon} emoji={emoji} caption={caption} className="posting-button" negative={negative}
                        accepted={accepted} invisible={invisible}
                        onReactionAdd={(negative, emoji) => dispatch(postingReact(id, negative, emoji, ""))}
                        onReactionDelete={() => dispatch(postingReactionDelete(id, ""))}/>
    );
}
