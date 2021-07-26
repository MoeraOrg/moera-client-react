import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IconName } from '@fortawesome/free-regular-svg-icons';

import { postingReact, postingReactionDelete } from "state/postings/actions";
import { ReactionButton } from "ui/control";
import "./PostingButton.css";

type Props = {
    icon: IconName;
    caption: string;
    invisible: boolean;
    id: string;
    negative: boolean;
    emoji: number | null;
    accepted: string;
} & ConnectedProps<typeof connector>;

const PostingReactionButton = ({icon, caption, invisible, id, negative, emoji, accepted, postingReact,
                                postingReactionDelete}: Props) => (
    <ReactionButton icon={icon} emoji={emoji} caption={caption} className="posting-button" negative={negative}
                    accepted={accepted} invisible={invisible}
                    onReactionAdd={(negative, emoji) => postingReact(id, negative, emoji)}
                    onReactionDelete={() => postingReactionDelete(id)}/>
);

const connector = connect(
    null,
    { postingReact, postingReactionDelete }
);

export default connector(PostingReactionButton);
