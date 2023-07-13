import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientReactionInfo, CommentInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import { isPermitted, IsPermittedOptions } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { getCommentsReceiverFeatures } from "state/detailedposting/selectors";
import CommentReactionButton from "ui/comment/CommentReactionButton";
import CommentReplyButton from "ui/comment/CommentReplyButton";
import CommentShareButton from "ui/comment/CommentShareButton";
import "./CommentButtons.css";

interface OwnProps {
    nodeName: string;
    postingId: string;
    comment: CommentInfo;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function CommentButtons({nodeName, postingId, comment, homeOwnerName, enableSelf, reactionsEnabled,
                         reactionsNegativeEnabled}: Props) {
    const {t} = useTranslation();

    const cr = comment.clientReaction || {} as ClientReactionInfo;
    const hideAll = !reactionsEnabled || (comment.ownerName === homeOwnerName && !enableSelf && !cr.emoji);
    const hidePositive = hideAll || (cr.emoji != null && cr.negative);
    const hideNegative = hideAll || !reactionsNegativeEnabled || (cr.emoji != null && !cr.negative);
    return (
        <div className="comment-buttons">
            <CommentReactionButton icon="thumbs-up" caption={t("support")} invisible={hidePositive} id={comment.id}
                                   negative={false} emoji={!cr.negative ? cr.emoji : null}
                                   accepted={comment.acceptedReactions?.positive ?? ""}/>
            <CommentReactionButton icon="thumbs-down" caption={t("oppose")} invisible={hideNegative} id={comment.id}
                                   negative={true} emoji={cr.negative ? cr.emoji : null}
                                   accepted={comment.acceptedReactions?.negative ?? ""}/>
            <CommentReplyButton comment={comment}/>
            <CommentShareButton nodeName={nodeName} postingId={postingId} commentId={comment.id}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => {
        const options: Partial<IsPermittedOptions> = {
            objectSourceName: props.nodeName,
            objectSourceFeatures: getCommentsReceiverFeatures(state)
        };
        return ({
            homeOwnerName: getHomeOwnerName(state),
            enableSelf: getSetting(state, "comment.reactions.self.enabled") as boolean,
            reactionsEnabled: isPermitted("addReaction", props.comment, "public", state, options),
            reactionsNegativeEnabled: isPermitted("addNegativeReaction", props.comment, "signed", state, options)
        });
    }
);

export default connector(CommentButtons);
