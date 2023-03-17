import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { ClientReactionInfo, PostingInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getHomeOwnerName, isConnectedToHome } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { MinimalStoryInfo } from "ui/types";
import PostingReactionButton from "ui/posting/PostingReactionButton";
import PostingCommentButton from "ui/posting/PostingCommentButton";
import PostingShareButton from "ui/posting/PostingShareButton";
import PostingMenu from "ui/posting/PostingMenu";
import "./PostingButtons.css";

interface OwnProps {
    posting: PostingInfo;
    story: MinimalStoryInfo;
    menu?: boolean;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function PostingButtons({
    posting, story, menu = false, connectedToHome, homeOwnerName, enableSelf, commentsVisible, reactionsEnabled,
    reactionsNegativeEnabled
}: Props) {
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
        <div className={cx("posting-buttons", {"with-menu": menu})}>
            {(connectedToHome && posting.receiverDeletedAt == null) &&
                <>
                    <PostingReactionButton icon="thumbs-up" caption={t("support")}
                                           invisible={hidePositive} id={posting.id} negative={false}
                                           emoji={!cr.negative ? cr.emoji : null}
                                           accepted={posting.acceptedReactions?.positive ?? ""}/>
                    <PostingReactionButton icon="thumbs-down" caption={t("oppose")}
                                           invisible={hideNegative} id={posting.id} negative={true}
                                           emoji={cr.negative ? cr.emoji : null}
                                           accepted={posting.acceptedReactions?.negative ?? ""}/>
                    <PostingCommentButton posting={posting} invisible={!commentsVisible}/>
                    <PostingShareButton posting={posting}/>
                </>
            }
            {menu && <PostingMenu posting={posting} story={story} detailed/>}
        </div>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        connectedToHome: isConnectedToHome(state),
        homeOwnerName: getHomeOwnerName(state),
        enableSelf: getSetting(state, "posting.reactions.self.enabled") as boolean,
        commentsVisible: isPermitted("viewComments", props.posting, "public", state),
        reactionsEnabled: isPermitted("addReaction", props.posting, "signed", state),
        reactionsNegativeEnabled: isPermitted("addNegativeReaction", props.posting, "signed", state)
    })
);

export default connector(PostingButtons);
