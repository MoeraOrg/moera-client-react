import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { isConnectedToHome } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import PostingMenu from "ui/posting/PostingMenu";
import PostingPin from "ui/posting/PostingPin";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingDeleting from "ui/posting/PostingDeleting";
import PostingDate from "ui/posting/PostingDate";
import PostingAvatar from "ui/posting/PostingAvatar";
import PostingSource from "ui/posting/PostingSource";
import PostingOwner from "ui/posting/PostingOwner";
import PostingSubject from "ui/posting/PostingSubject";
import PostingReactions from "ui/posting/PostingReactions";
import PostingButtons from "ui/posting/PostingButtons";
import EntryHtml from "ui/posting/EntryHtml";
import PostingComments from "ui/posting/PostingComments";
import Comments from "ui/comment/Comments";
import { ClientState } from "state/state";
import { FeedReference, PostingInfo } from "api/node/api-types";

type Props = {
    story: FeedReference | null;
    posting: PostingInfo;
    deleting?: boolean | null;
} & ConnectedProps<typeof connector>;

const DetailedPosting = ({story, posting, deleting, connectedToHome, isPermitted}: Props) => (
    <>
        <div className="posting entry mt-2">
            {deleting ?
                <PostingDeleting/>
            :
                <>
                    <PostingMenu posting={posting} story={story} isPermitted={isPermitted}/>
                    <PostingPin pinned={story != null && story.pinned}/>
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

const connector = connect(
    (state: ClientState) => ({
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation: string, posting: PostingInfo) => isPermitted(operation, posting, state),
    })
);

export default connector(DetailedPosting);
