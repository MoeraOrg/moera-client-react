import React from 'react';
import { useSelector } from 'react-redux';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ExtPostingInfo } from "state/postings/state";
import { getHomeOwnerName } from "state/home/selectors";
import { jumpNear } from "state/navigation/actions";
import { useDispatcher } from "ui/hook";
import { MinimalStoryInfo } from "ui/types";
import { getFeedProperties } from "ui/feed/feeds";
import PostingMenu from "ui/posting/PostingMenu";
import StoryBadges from "ui/story/StoryBadges";
import PostingDate from "ui/posting/PostingDate";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingVisibility from "ui/posting/PostingVisibility";
import PostingAvatar from "ui/posting/PostingAvatar";
import PostingSource from "ui/posting/PostingSource";
import PostingOwner from "ui/posting/PostingOwner";
import PostingSheriffVisibility from "ui/posting/PostingSheriffVisibility";
import PostingSubject from "ui/posting/PostingSubject";
import PostingPreviewContent from "ui/posting/PostingPreviewContent";
import EntryGallery from "ui/entry/EntryGallery";
import EntryAttachments from "ui/entry/EntryAttachments";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";
import PostingReactions from "ui/posting/PostingReactions";
import PostingSharings from "ui/posting/PostingSharings";
import PostingComments from "ui/posting/PostingComments";
import PostingViews from "ui/posting/PostingViews";
import PostingButtons from "ui/posting/PostingButtons";
import { RelNodeName } from "util/rel-node-name";
import { ut } from "util/url";
import "ui/posting/Posting.css";
import "ui/entry/Entry.css";

interface FeedPostingProps {
    nodeName: RelNodeName | string;
    posting: ExtPostingInfo;
    feedName: string;
    story: MinimalStoryInfo;
}

export default function FeedPosting({nodeName, posting, feedName, story}: FeedPostingProps) {
    const isSheriff = useSelector(getHomeOwnerName) === SHERIFF_GOOGLE_PLAY_TIMELINE;
    const dispatch = useDispatcher();

    const {recommendedOnly} = getFeedProperties(feedName);

    return (
        <>
            <PostingMenu posting={posting} feedName={feedName} story={story}/>
            <StoryBadges pinned={story.pinned} recommended={!recommendedOnly && posting.recommended}/>
            <div className="owner-line">
                <PostingAvatar posting={posting}/>
                <div className="owner-info">
                    <PostingSource posting={posting}/>
                    <PostingOwner posting={posting}/>
                    {isSheriff &&
                        <PostingSheriffVisibility posting={posting}/>
                    }
                    <br/>
                    <PostingDate posting={posting}/>
                    {posting.totalRevisions > 1 &&
                        <PostingUpdated
                            createdAt={posting.createdAt}
                            editedAt={posting.editedAt}
                            publishedAt={story.publishedAt}
                        />
                    }
                    <PostingVisibility posting={posting}/>
                </div>
            </div>
            <PostingSubject posting={posting} preview={true}/>
            <PostingPreviewContent nodeName={nodeName} posting={posting}/>
            {!posting.bodyPreview?.text &&
                <EntryAttachments nodeName={nodeName} media={posting.media ?? null} limit={2}/>
            }
            <EntryGallery
                postingId={posting.id}
                nodeName={nodeName}
                media={posting.media ?? null}
                onExpand={() => dispatch(jumpNear(ut`/post/${posting.id}`, "expanded=true", null))}
            />
            <EntryLinkPreviews
                nodeName={nodeName}
                linkPreviews={posting.bodyPreview?.linkPreviews ?? posting.body.linkPreviews}
                noFollow={false}
                limit={2}
                media={posting.media ?? null}
            />
            <div className="reactions-line">
                <div className="left-group">
                    <PostingReactions nodeName={nodeName} postingId={posting.id} reactions={posting.reactions}/>
                    <PostingSharings nodeName={nodeName} posting={posting}/>
                </div>
                <div className="right-group">
                    <PostingViews viewCount={posting.viewCount}/>
                    <PostingComments postingId={posting.id} totalComments={posting.totalComments}/>
                </div>
            </div>
            <PostingButtons posting={posting} feedName={feedName} story={story}/>
        </>
    );
}
