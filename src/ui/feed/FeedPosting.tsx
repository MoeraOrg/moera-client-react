import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import { ExtPostingInfo } from "state/postings/state";
import { isAtHomeNode, isPermitted, ProtectedObject } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { MinimalStoryInfo } from "ui/types";
import PostingMenu from "ui/posting/PostingMenu";
import PostingPin from "ui/posting/PostingPin";
import PostingDate from "ui/posting/PostingDate";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingDeleting from "ui/posting/PostingDeleting";
import PostingAvatar from "ui/posting/PostingAvatar";
import PostingSource from "ui/posting/PostingSource";
import PostingOwner from "ui/posting/PostingOwner";
import PostingSubject from "ui/posting/PostingSubject";
import EntryHtml from "ui/posting/EntryHtml";
import PostingReactions from "ui/posting/PostingReactions";
import PostingComments from "ui/posting/PostingComments";
import PostingButtons from "ui/posting/PostingButtons";
import Jump from "ui/navigation/Jump";
import "ui/posting/Posting.css";
import "ui/posting/Entry.css";
import PostingGallery from "ui/posting/PostingGallery";

interface ContentProps {
    posting: ExtPostingInfo;
}

function Content({posting}: ContentProps) {
    if (posting.bodyPreview != null && posting.bodyPreview.text) {
        return (
            <div className="content">
                <EntryHtml postingId={posting.id} html={posting.bodyPreview.text} media={posting.media}/>
                <Jump href={`/post/${posting.id}`} className="btn btn-link read-more">Continue Reading &rarr;</Jump>
            </div>
        );
    } else {
        return (
            <EntryHtml className="content" postingId={posting.id} html={posting.body.previewText}
                       media={posting.media}/>
        );
    }
}

type FeedPostingProps = {
    posting: ExtPostingInfo;
    story: MinimalStoryInfo;
    deleting: boolean;
} & ConnectedProps<typeof connector>;

const FeedPosting = ({posting, story, deleting, connectedToHome, atHome, isPermitted}: FeedPostingProps) => (
    <div className={cx("posting entry preview", {"not-viewed": atHome && story.viewed === false})}
         data-moment={story.moment} data-viewed={story.viewed !== false}>
        {deleting ?
            <PostingDeleting/>
        :
            <>
                <PostingMenu posting={posting} story={story} isPermitted={isPermitted}/>
                <PostingPin pinned={story.pinned}/>
                <div className="owner-line">
                    <PostingAvatar posting={posting}/>
                    <div className="owner-info">
                        <PostingSource posting={posting}/>
                        <PostingOwner posting={posting}/>
                        <br/>
                        <PostingDate posting={posting} story={story}/>
                        <PostingUpdated posting={posting} story={story}/>
                    </div>
                </div>
                <PostingSubject posting={posting} preview={true}/>
                <Content posting={posting}/>
                <PostingGallery postingId={posting.id} media={posting.media ?? null}/>
                <div className="reactions-line">
                    <PostingReactions posting={posting}/>
                    <PostingComments posting={posting}/>
                </div>
                {connectedToHome && <PostingButtons posting={posting}/>}
            </>
        }
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        connectedToHome: isConnectedToHome(state),
        atHome: isAtHomeNode(state),
        isPermitted: (operation: string, posting: ProtectedObject) => isPermitted(operation, posting, state)
    })
);

export default connector(FeedPosting);
