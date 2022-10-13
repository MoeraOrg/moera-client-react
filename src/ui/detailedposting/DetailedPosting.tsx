import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { PostingInfo, PrincipalValue } from "api/node/api-types";
import { ClientState } from "state/state";
import { detailedPostingLoadAttached } from "state/detailedposting/actions";
import { isConnectedToHome } from "state/home/selectors";
import { isPermitted, ProtectedObject } from "state/node/selectors";
import { MinimalStoryInfo } from "ui/types";
import PostingMenu from "ui/posting/PostingMenu";
import PostingPin from "ui/posting/PostingPin";
import PostingDate from "ui/posting/PostingDate";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingVisibility from "ui/posting/PostingVisibility";
import PostingDeleting from "ui/posting/PostingDeleting";
import PostingAvatar from "ui/posting/PostingAvatar";
import PostingSource from "ui/posting/PostingSource";
import PostingOwner from "ui/posting/PostingOwner";
import PostingSubject from "ui/posting/PostingSubject";
import PostingReactions from "ui/posting/PostingReactions";
import PostingButtons from "ui/posting/PostingButtons";
import EntryHtml from "ui/entry/EntryHtml";
import EntryGallery from "ui/entry/EntryGallery";
import EntryGalleryExpanded from "ui/entry/EntryGalleryExpanded";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";
import PostingComments from "ui/posting/PostingComments";
import Comments from "ui/comment/Comments";
import { getPageHeaderHeight } from "util/misc";

type Props = {
    story: MinimalStoryInfo;
    posting: PostingInfo;
    deleting?: boolean | null;
} & ConnectedProps<typeof connector>;

function DetailedPosting({story, posting, deleting, loadedAttached, galleryExpanded, connectedToHome, isPermitted,
                          detailedPostingLoadAttached}: Props) {
    const [expanded, setExpanded] = useState<boolean>(galleryExpanded);

    if (deleting) {
        return (
            <div className="posting entry mt-2">
                <PostingDeleting/>
            </div>
        );
    }

    const onExpand = () => {
        setExpanded(true);
        if (!loadedAttached) {
            detailedPostingLoadAttached();
        }
        scrollToPostingGallery();
    }

    const onCollapse = () => {
        setExpanded(false);
        scrollToPostingGallery();
    }

    return (
        <div className="posting entry mt-2">
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
                    <PostingVisibility posting={posting} editable={isPermitted("edit", posting, "owner")}/>
                </div>
            </div>
            <PostingSubject posting={posting} preview={false}/>
            <EntryHtml className="content" postingId={posting.id} html={posting.body.text} nodeName=""
                       media={posting.media}/>
            <EntryLinkPreviews nodeName="" linkPreviews={posting.body.linkPreviews} media={posting.media ?? null}/>
            {!expanded &&
                <div id="posting-gallery" className="gallery-collapsed">
                    <EntryGallery postingId={posting.id} nodeName="" media={posting.media ?? null} onExpand={onExpand}/>
                </div>
            }
            <div className="reactions-line">
                <PostingReactions posting={posting}/>
                <PostingComments posting={posting}/>
            </div>
            {(connectedToHome && posting.receiverDeletedAt == null) &&
                <PostingButtons posting={posting}/>
            }
            {expanded &&
                <EntryGalleryExpanded postingId={posting.id} nodeName="" media={posting.media ?? null}
                                      onCollapse={onCollapse}/>
            }
            {posting.receiverDeletedAt == null &&
                <Comments/>
            }
        </div>
    );
}

function scrollToPostingGallery() {
    setTimeout(() => {
        const y = document.getElementById("posting-gallery")!.getBoundingClientRect().top;
        window.scrollBy(0, y - getPageHeaderHeight());
    });
}

const connector = connect(
    (state: ClientState) => ({
        loadedAttached: state.detailedPosting.loadedAttached,
        galleryExpanded: state.detailedPosting.galleryExpanded,
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation: string, object: ProtectedObject, defaultValue: PrincipalValue) =>
            isPermitted(operation, object, defaultValue, state),
    }),
    { detailedPostingLoadAttached }
);

export default connector(DetailedPosting);
