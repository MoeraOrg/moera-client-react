import React from 'react';
import { connect } from 'react-redux';

import { isConnectedToHome } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import PostingMenu from "ui/posting/PostingMenu";
import PostingPin from "ui/posting/PostingPin";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingDeleting from "ui/posting/PostingDeleting";
import PostingDate from "ui/posting/PostingDate";
import PostingSource from "ui/posting/PostingSource";
import PostingOwner from "ui/posting/PostingOwner";
import PostingSubject from "ui/posting/PostingSubject";
import PostingReactions from "ui/posting/PostingReactions";
import PostingButtons from "ui/posting/PostingButtons";
import EntryHtml from "ui/posting/EntryHtml";
import PostingComments from "ui/posting/PostingComments";
import Comments from "ui/comment/Comments";

const DetailedPostingImpl = ({story, posting, deleting, connectedToHome, isPermitted}) => (
    <>
        <div className="posting entry mt-2">
            {deleting ?
                <PostingDeleting/>
            :
                <>
                    <PostingMenu posting={posting} story={story} isPermitted={isPermitted}/>
                    <PostingPin pinned={story != null && story.pinned}/>
                    <div className="owner-line">
                        <PostingSource posting={posting}/>
                        <PostingOwner posting={posting}/>
                        <PostingDate posting={posting} story={story}/>
                        <PostingUpdated posting={posting} story={story}/>
                    </div>
                    <PostingSubject posting={posting} preview={false}/>
                    <EntryHtml className="content" html={posting.body.text}/>
                    <div className="reactions-line">
                        <PostingReactions posting={posting}/>
                        <PostingComments posting={posting}/>
                    </div>
                    {connectedToHome && <PostingButtons posting={posting}/>}
                    <Comments postingId={posting.id}/>
                </>
            }
        </div>
    </>
);

const DetailedPosting = ({posting, story, deleting, connectedToHome, isPermitted}) => {
    return <DetailedPostingImpl story={story} posting={posting} deleting={deleting} connectedToHome={connectedToHome}
                                isPermitted={isPermitted}/>
}

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation, posting) => isPermitted(operation, posting, state)
    })
)(DetailedPosting);
