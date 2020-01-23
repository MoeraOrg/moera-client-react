import React from 'react';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { goToTimeline } from "state/navigation/actions";
import { isConnectedToHome } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import PostingMenu from "ui/posting/PostingMenu";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingDeleting from "ui/posting/PostingDeleting";
import PostingDate from "ui/posting/PostingDate";
import PostingOwner from "ui/posting/PostingOwner";
import PostingSubject from "ui/posting/PostingSubject";
import PostingReactions from "ui/posting/PostingReactions";
import PostingButtons from "ui/posting/PostingButtons";

const DetailedPosting = ({posting, deleting, connectedToHome, isPermitted, goToTimeline}) => (
    <>
        <Button variant="outline-secondary" size="sm"
                onClick={e => goToTimeline(posting.moment)}>&larr; Timeline</Button>

        <div className="posting">
            {deleting ?
                <PostingDeleting/>
            :
                <>
                    <PostingMenu posting={posting} isPermitted={isPermitted}/>
                    <div className="owner-line">
                        <PostingOwner posting={posting}/>
                        <PostingDate posting={posting}/>
                        <PostingUpdated posting={posting}/>
                    </div>
                    <PostingSubject posting={posting} preview={false}/>
                    <div className="content" dangerouslySetInnerHTML={{__html: posting.body.text}}/>
                    <PostingReactions posting={posting}/>
                    {connectedToHome && <PostingButtons posting={posting}/>}
                </>
            }
        </div>
    </>
);

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation, posting) => isPermitted(operation, posting, state)
    }),
    { goToTimeline }
)(DetailedPosting);
