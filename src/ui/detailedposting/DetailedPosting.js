import React from 'react';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { getPostingFeedReference } from "state/postings/selectors";
import { goToNews, goToTimeline } from "state/navigation/actions";
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
import PostingHtml from "ui/posting/PostingHtml";

const DetailedPostingImpl = ({story, posting, deleting, connectedToHome, isPermitted, feedTitle, goToFeed}) => (
    <>
        {story != null &&
            <Button variant="outline-secondary" size="sm" onClick={() => goToFeed(story.moment)}>
                &larr; {feedTitle}
            </Button>
        }

        <div className="posting mt-2">
            {deleting ?
                <PostingDeleting/>
            :
                <>
                    <PostingMenu posting={posting} story={story} isPermitted={isPermitted}/>
                    <PostingPin pinned={story != null && story.pinned}/>
                    <div className="owner-line">
                        <PostingSource posting={posting}/>
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

const DetailedPosting = ({posting, deleting, connectedToHome, isPermitted, goToTimeline, goToNews}) => {
    let story = getPostingFeedReference(posting, "timeline");
    if (story != null) {
        return <DetailedPostingImpl story={story} posting={posting} deleting={deleting}
                                    connectedToHome={connectedToHome} isPermitted={isPermitted} feedTitle="Timeline"
                                    goToFeed={goToTimeline}/>
    } else {
        story = getPostingFeedReference(posting, "news");
        return <DetailedPostingImpl story={story} posting={posting} deleting={deleting}
                                    connectedToHome={connectedToHome} isPermitted={isPermitted} feedTitle="News"
                                    goToFeed={goToNews}/>
    }
}

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation, posting) => isPermitted(operation, posting, state)
    }),
    { goToTimeline, goToNews }
)(DetailedPosting);
