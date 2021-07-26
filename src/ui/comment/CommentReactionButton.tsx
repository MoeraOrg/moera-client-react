import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IconName } from '@fortawesome/free-regular-svg-icons';

import { ReactionButton } from "ui/control";
import { ClientState } from "state/state";
import { commentReact, commentReactionDelete } from "state/detailedposting/actions";
import { getCommentsReceiverPostingId } from "state/detailedposting/selectors";
import "./CommentButton.css";

type Props = {
    icon: IconName;
    caption: string;
    invisible: boolean;
    id: string;
    negative: boolean;
    emoji: number | null;
    accepted: string;
} & ConnectedProps<typeof connector>;

const CommentReactionButton = ({icon, caption, invisible, id, negative, emoji, accepted, postingId, commentReact,
                                commentReactionDelete}: Props) => (
    postingId != null ?
        <ReactionButton icon={icon} emoji={emoji} caption={caption} className="comment-button" negative={negative}
                        accepted={accepted} invisible={invisible}
                        onReactionAdd={(negative, emoji) => commentReact(id, negative, emoji)}
                        onReactionDelete={() => commentReactionDelete(id, postingId)}/>
    :
        null
);

const connector = connect(
    (state: ClientState) => ({
        postingId: getCommentsReceiverPostingId(state)
    }),
    { commentReact, commentReactionDelete }
);

export default connector(CommentReactionButton);
