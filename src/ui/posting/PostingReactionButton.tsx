import React from 'react';
import { useDispatch } from 'react-redux';

import { postingReact, postingReactionDelete } from "state/postings/actions";
import { ReactionButton } from "ui/control";
import { MaterialSymbol } from "ui/material-symbols";
import { REL_CURRENT } from "util/rel-node-name";
import "./PostingButton.css";

interface Props {
    icon: MaterialSymbol;
    caption: string;
    invisible: boolean;
    id: string;
    negative: boolean;
    emoji: number | null;
    rejected?: string | null;
}

export default function PostingReactionButton({icon, caption, invisible, id, negative, emoji, rejected}: Props) {
    const dispatch = useDispatch();

    return (
        <ReactionButton
            icon={icon}
            emoji={emoji}
            caption={caption}
            className="posting-button"
            negative={negative}
            rejected={rejected}
            invisible={invisible}
            onReactionAdd={(negative, emoji) => dispatch(postingReact(id, negative, emoji, REL_CURRENT))}
            onReactionDelete={() => dispatch(postingReactionDelete(id, REL_CURRENT))}
        />
    );
}
