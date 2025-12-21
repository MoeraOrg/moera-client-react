import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { detailedPostingExpandGallery, detailedPostingLoadAttached } from "state/detailedposting/actions";
import { isPermitted } from "state/node/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { MinimalStoryInfo } from "ui/types";
import PostingMenu from "ui/posting/PostingMenu";
import StoryBadges from "ui/story/StoryBadges";
import PostingDate from "ui/posting/PostingDate";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingVisibility from "ui/posting/PostingVisibility";
import PostingDeleting from "ui/posting/PostingDeleting";
import PostingAvatar from "ui/posting/PostingAvatar";
import PostingSource from "ui/posting/PostingSource";
import PostingOwner from "ui/posting/PostingOwner";
import PostingSheriffVisibility from "ui/posting/PostingSheriffVisibility";
import PostingSubject from "ui/posting/PostingSubject";
import PostingReactions from "ui/posting/PostingReactions";
import PostingButtons from "ui/posting/PostingButtons";
import EntryHtml from "ui/entry/EntryHtml";
import EntryGallery from "ui/entry/EntryGallery";
import EntryGalleryExpanded from "ui/entry/EntryGalleryExpanded";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";
import PostingComments from "ui/posting/PostingComments";
import Comments from "ui/comment/Comments";
import { REL_CURRENT } from "util/rel-node-name";
import { getPageHeaderHeight } from "util/ui";

interface Props {
    story: MinimalStoryInfo | null;
    posting: PostingInfo;
    deleting?: boolean | null;
}

export default function DetailedPosting({story, posting, deleting}: Props) {
    const loadedAttached = useSelector((state: ClientState) => state.detailedPosting.loadedAttached);
    const expanded = useSelector((state: ClientState) => state.detailedPosting.galleryExpanded);
    const postingEditable = useSelector((state: ClientState) => isPermitted("edit", posting, "owner", state));
    const isSheriff = useSelector((state: ClientState) => getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE);
    const dispatch = useDispatch();

    if (deleting) {
        return (
            <div className="posting entry mt-2">
                <PostingDeleting/>
            </div>
        );
    }

    const onExpand = () => {
        dispatch(detailedPostingExpandGallery(true));
        if (!loadedAttached) {
            dispatch(detailedPostingLoadAttached());
        }
        scrollToPostingGallery();
    }

    const onCollapse = () => {
        dispatch(detailedPostingExpandGallery(false));
        scrollToPostingGallery();
    }

    return (
        <main className="posting entry mt-2">
            <PostingMenu posting={posting} story={story} detailed/>
            <StoryBadges pinned={story != null && story.pinned} recommended={posting.recommended}/>
            <div className="owner-line">
                <PostingAvatar posting={posting}/>
                <div className="owner-info">
                    <PostingSource posting={posting}/>
                    <PostingOwner posting={posting}/>
                    {isSheriff &&
                        <PostingSheriffVisibility posting={posting}/>
                    }
                    <br/>
                    <PostingDate posting={posting} publishedAt={story != null ? story.publishedAt : posting.createdAt}/>
                    {posting.totalRevisions > 1 &&
                        <PostingUpdated createdAt={posting.createdAt} editedAt={posting.editedAt}
                                        publishedAt={story != null ? story.publishedAt : posting.createdAt}/>
                    }
                    <PostingVisibility posting={posting} editable={postingEditable}/>
                </div>
            </div>
            <PostingSubject posting={posting} preview={false}/>
            <EntryHtml className="content" postingId={posting.id} html={posting.body.text} nodeName={REL_CURRENT}
                       media={posting.media}/>
            {!expanded &&
                <div id="posting-gallery" className="gallery-collapsed">
                    <EntryGallery postingId={posting.id} nodeName={REL_CURRENT} media={posting.media ?? null}
                                  onExpand={onExpand}/>
                </div>
            }
            <EntryLinkPreviews nodeName={REL_CURRENT} linkPreviews={posting.body.linkPreviews}
                               media={posting.media ?? null}/>
            <div className="reactions-line">
                <PostingReactions nodeName={REL_CURRENT} postingId={posting.id} reactions={posting.reactions}/>
                <PostingComments postingId={posting.id} totalComments={posting.totalComments}/>
            </div>
            <PostingButtons posting={posting} story={story} menu/>
            {expanded &&
                <EntryGalleryExpanded postingId={posting.id} nodeName={REL_CURRENT} media={posting.media ?? null}
                                      onCollapse={onCollapse}/>
            }
            {posting.receiverDeletedAt == null &&
                <Comments/>
            }
        </main>
    );
}

function scrollToPostingGallery() {
    setTimeout(() => {
        const y = document.getElementById("posting-gallery")!.getBoundingClientRect().top;
        window.scrollBy(0, y - getPageHeaderHeight());
    });
}
