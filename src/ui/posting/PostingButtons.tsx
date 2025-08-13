import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientReactionInfo, PostingInfo } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerName, isConnectedToHome } from "state/home/selectors";
import { isPermitted, IsPermittedOptions } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { getCommentsReceiverFeatures, getCommentsReceiverName } from "state/detailedposting/selectors";
import { MinimalStoryInfo } from "ui/types";
import { msThumbDown, msThumbUp } from "ui/material-symbols";
import PostingReactionButton from "ui/posting/PostingReactionButton";
import PostingCommentButton from "ui/posting/PostingCommentButton";
import PostingShareButton from "ui/posting/PostingShareButton";
import PostingMenu from "ui/posting/PostingMenu";
import "./PostingButtons.css";

interface Props {
    posting: PostingInfo;
    story: MinimalStoryInfo;
    menu?: boolean;
}

export default function PostingButtons({posting, story, menu = false}: Props) {
    const options: Partial<IsPermittedOptions> = {
        objectSourceName: useSelector(getCommentsReceiverName),
        objectSourceFeatures: useSelector(getCommentsReceiverFeatures)
    }
    const connectedToHome = useSelector(isConnectedToHome);
    const homeOwnerName = useSelector(getHomeOwnerName);
    const enableSelf = useSelector((state: ClientState) =>
        getSetting(state, "posting.reactions.self.enabled") as boolean
    );
    const commentsVisible = useSelector((state: ClientState) =>
        isPermitted("viewComments", posting, "public", state, options)
    );
    const reactionsEnabled = useSelector((state: ClientState) =>
        isPermitted("addReaction", posting, "signed", state, options)
    );
    const reactionsNegativeEnabled = useSelector((state: ClientState) =>
        isPermitted("addNegativeReaction", posting, "signed", state, options)
    );
    const {t} = useTranslation();

    const showButtons = connectedToHome && posting.receiverDeletedAt == null;
    if (!showButtons && !menu) {
        return null;
    }

    const cr = posting.clientReaction || {} as ClientReactionInfo;
    const hideAll = !reactionsEnabled || (posting.ownerName === homeOwnerName && !enableSelf && !cr.emoji);
    const hidePositive = hideAll || (cr.emoji != null && cr.negative);
    const hideNegative = hideAll || !reactionsNegativeEnabled || (cr.emoji != null && !cr.negative);
    return (
        <div className="posting-buttons">
            {(connectedToHome && posting.receiverDeletedAt == null) &&
                <>
                    <PostingReactionButton
                        icon={msThumbUp}
                        caption={t("support")}
                        invisible={hidePositive}
                        id={posting.id}
                        negative={false}
                        emoji={!cr.negative ? cr.emoji : null}
                        rejected={posting.rejectedReactions?.positive}
                    />
                    <PostingReactionButton
                        icon={msThumbDown}
                        caption={t("oppose")}
                        invisible={hideNegative}
                        id={posting.id}
                        negative={true}
                        emoji={cr.negative ? cr.emoji : null}
                        rejected={posting.rejectedReactions?.negative}
                    />
                    <PostingShareButton postingId={posting.id} postingReceiverName={posting.receiverName}
                                        postingReceiverPostingId={posting.receiverPostingId}/>
                    <div className="divider"/>
                    <PostingCommentButton postingId={posting.id} invisible={!commentsVisible}/>
                </>
            }
            {menu && <PostingMenu posting={posting} story={story} detailed/>}
        </div>
    );
}
