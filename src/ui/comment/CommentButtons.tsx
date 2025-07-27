import React from 'react';
import { useSelector } from 'react-redux';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';

import { ClientReactionInfo, CommentInfo } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import { isPermitted, IsPermittedOptions } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { getCommentsReceiverFeatures } from "state/detailedposting/selectors";
import CommentReactionButton from "ui/comment/CommentReactionButton";
import CommentReplyButton from "ui/comment/CommentReplyButton";
import CommentShareButton from "ui/comment/CommentShareButton";
import "./CommentButtons.css";

interface Props {
    nodeName: string;
    postingId: string;
    comment: CommentInfo;
}

export default function CommentButtons({nodeName, postingId, comment}: Props) {
    const options: Partial<IsPermittedOptions> = {
        objectSourceName: nodeName,
        objectSourceFeatures: useSelector(getCommentsReceiverFeatures)
    };
    const homeOwnerName = useSelector(getHomeOwnerName);
    const enableSelf = useSelector((state: ClientState) =>
        getSetting(state, "comment.reactions.self.enabled") as boolean
    );
    const reactionsEnabled = useSelector((state: ClientState) =>
        isPermitted("addReaction", comment, "public", state, options)
    );
    const reactionsNegativeEnabled = useSelector((state: ClientState) =>
        isPermitted("addNegativeReaction", comment, "signed", state, options)
    );
    const {t} = useTranslation();

    const cr = comment.clientReaction || {} as ClientReactionInfo;
    const hideAll = !reactionsEnabled || (comment.ownerName === homeOwnerName && !enableSelf && !cr.emoji);
    const hidePositive = hideAll || (cr.emoji != null && cr.negative);
    const hideNegative = hideAll || !reactionsNegativeEnabled || (cr.emoji != null && !cr.negative);
    return (
        <div className="comment-buttons">
            <CommentReactionButton
                icon={faThumbsUp}
                caption={t("support")}
                invisible={hidePositive}
                id={comment.id}
                negative={false}
                emoji={!cr.negative ? cr.emoji : null}
                rejected={comment.rejectedReactions?.positive}
            />
            <CommentReactionButton
                icon={faThumbsDown}
                caption={t("oppose")}
                invisible={hideNegative}
                id={comment.id}
                negative={true}
                emoji={cr.negative ? cr.emoji : null}
                rejected={comment.rejectedReactions?.negative}
            />
            <CommentReplyButton id={comment.id} ownerName={comment.ownerName}
                                ownerFullName={comment.ownerFullName ?? null} heading={comment.heading}/>
            <CommentShareButton nodeName={nodeName} postingId={postingId} commentId={comment.id}/>
        </div>
    );
}
