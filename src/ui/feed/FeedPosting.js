import React from 'react';
import { connect } from 'react-redux';

import { isPermitted } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import PostingMenu from "ui/posting/PostingMenu";
import PostingPin from "ui/posting/PostingPin";
import PostingDate from "ui/posting/PostingDate";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingDeleting from "ui/posting/PostingDeleting";
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

const Content = ({posting}) => {
    if (posting.bodyPreview.text) {
        return (
            <div className="content">
                <EntryHtml html={posting.bodyPreview.text}/>
                <Jump href={`/post/${posting.id}`} className="btn btn-link read-more">Continue Reading &rarr;</Jump>
            </div>
        );
    } else {
        return (
            <EntryHtml className="content" html={posting.body.previewText}/>
        );
    }
};

const FeedPosting = ({posting, story, deleting, isPermitted, connectedToHome}) => (
    <div className="posting entry preview" data-moment={story.moment} data-viewed={story.viewed}>
        {deleting ?
            <PostingDeleting/>
        :
            <>
                <PostingMenu posting={posting} story={story} isPermitted={isPermitted}/>
                <PostingPin pinned={story.pinned}/>
                <div className="owner-line">
                    <PostingSource posting={posting}/>
                    <PostingOwner posting={posting}/>
                    <PostingDate posting={posting} story={story}/>
                    <PostingUpdated posting={posting} story={story}/>
                </div>
                <PostingSubject posting={posting} preview={true}/>
                <Content posting={posting}/>
                <div className="reactions-line">
                    <PostingReactions posting={posting}/>
                    <PostingComments posting={posting}/>
                </div>
                {connectedToHome && <PostingButtons posting={posting}/>}
            </>
        }
    </div>
);

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation, posting) => isPermitted(operation, posting, state)
    })
)(FeedPosting);
