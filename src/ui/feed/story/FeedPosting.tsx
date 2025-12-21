import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import { ExtPostingInfo } from "state/postings/state";
import { getHomeOwnerName } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import { jumpNear } from "state/navigation/actions";
import { MinimalStoryInfo } from "ui/types";
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
import EntryHtml from "ui/entry/EntryHtml";
import EntryGallery from "ui/entry/EntryGallery";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";
import PostingReactions from "ui/posting/PostingReactions";
import PostingComments from "ui/posting/PostingComments";
import PostingButtons from "ui/posting/PostingButtons";
import Jump from "ui/navigation/Jump";
import { RelNodeName } from "util/rel-node-name";
import { ut } from "util/url";
import "ui/posting/Posting.css";
import "ui/entry/Entry.css";

interface ContentProps {
    nodeName: RelNodeName | string;
    posting: ExtPostingInfo;
}

function Content({nodeName, posting}: ContentProps) {
    const {t} = useTranslation();

    if (posting.bodyPreview != null && posting.bodyPreview.text) {
        return (
            <div className="content">
                <EntryHtml postingId={posting.id} html={posting.bodyPreview.text} nodeName={nodeName}
                           media={posting.media}/>
                <Jump href={ut`/post/${posting.id}`} className="btn btn-link read-more">{t("continue-reading")}</Jump>
            </div>
        );
    } else {
        return (
            <EntryHtml className="content" postingId={posting.id} html={posting.body.previewText} nodeName={nodeName}
                       media={posting.media}/>
        );
    }
}

interface FeedPostingProps {
    nodeName: RelNodeName | string;
    posting: ExtPostingInfo;
    story: MinimalStoryInfo;
    hideRecommended?: boolean;
}

export default function FeedPosting({nodeName, posting, story, hideRecommended}: FeedPostingProps) {
    const postingEditable = useSelector((state: ClientState) => isPermitted("edit", posting, "owner", state));
    const isSheriff = useSelector(getHomeOwnerName) === SHERIFF_GOOGLE_PLAY_TIMELINE;
    const dispatch = useDispatch();

    return (
        <>
            <PostingMenu posting={posting} story={story}/>
            <StoryBadges pinned={story.pinned} recommended={!hideRecommended && posting.recommended}/>
            <div className="owner-line">
                <PostingAvatar posting={posting}/>
                <div className="owner-info">
                    <PostingSource posting={posting}/>
                    <PostingOwner posting={posting}/>
                    {isSheriff &&
                        <PostingSheriffVisibility posting={posting}/>
                    }
                    <br/>
                    <PostingDate posting={posting} publishedAt={story.publishedAt}/>
                    {posting.totalRevisions > 1 &&
                        <PostingUpdated createdAt={posting.createdAt} editedAt={posting.editedAt}
                                        publishedAt={story.publishedAt}/>
                    }
                    <PostingVisibility posting={posting} editable={postingEditable}/>
                </div>
            </div>
            <PostingSubject posting={posting} preview={true}/>
            <Content nodeName={nodeName} posting={posting}/>
            <EntryGallery postingId={posting.id} nodeName={nodeName} media={posting.media ?? null}
                          onExpand={() => dispatch(jumpNear(ut`/post/${posting.id}`, "expanded=true", null))}/>
            <EntryLinkPreviews nodeName={nodeName}
                               linkPreviews={posting.bodyPreview?.linkPreviews ?? posting.body.linkPreviews}
                               limit={2} media={posting.media ?? null}/>
            <div className="reactions-line">
                <PostingReactions nodeName={nodeName} postingId={posting.id} reactions={posting.reactions}/>
                <PostingComments postingId={posting.id} totalComments={posting.totalComments}/>
            </div>
            <PostingButtons posting={posting} story={story}/>
        </>
    );
}
