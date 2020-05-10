import React from 'react';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { getPostingFeedReference } from "state/postings/selectors";
import { goToTimeline } from "state/navigation/actions";
import { isConnectedToHome } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import PostingMenu from "ui/posting/PostingMenu";
import PostingPin from "ui/posting/PostingPin";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingDeleting from "ui/posting/PostingDeleting";
import PostingDate from "ui/posting/PostingDate";
import PostingOwner from "ui/posting/PostingOwner";
import PostingSubject from "ui/posting/PostingSubject";
import PostingReactions from "ui/posting/PostingReactions";
import PostingButtons from "ui/posting/PostingButtons";
import PostingHtml from "ui/posting/PostingHtml";

const DetailedPosting = ({posting, deleting, connectedToHome, isPermitted, goToTimeline}) => {
    const story = getPostingFeedReference(posting, "timeline");
    return (
        <>
            {story != null &&
                <Button variant="outline-secondary" size="sm"
                        onClick={() => goToTimeline(story.moment)}>&larr; Timeline</Button>
            }

            <div className="posting mt-2">
                {deleting ?
                    <PostingDeleting/>
                :
                    <>
                        <PostingMenu posting={posting} story={story} isPermitted={isPermitted}/>
                        <PostingPin pinned={story != null && story.pinned}/>
                        <div className="owner-line">
                            <PostingOwner posting={posting}/>
                            <PostingDate id={posting.id}
                                         publishedAt={story != null ? story.publishedAt : posting.createdAt}/>
                            <PostingUpdated posting={posting}/>
                        </div>
                        <PostingSubject posting={posting} preview={false}/>
                        <PostingHtml className="content" html={posting.body.text}/>
                        <PostingReactions posting={posting}/>
                        {connectedToHome && <PostingButtons posting={posting}/>}
                    </>
                }
            </div>
        </>
    );
};

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation, posting) => isPermitted(operation, posting, state)
    }),
    { goToTimeline }
)(DetailedPosting);
