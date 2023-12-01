import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import { ExtPostingInfo } from "state/postings/state";
import { getHomeOwnerName } from "state/home/selectors";
import { isAtHomeNode, isPermitted } from "state/node/selectors";
import { goToPosting } from "state/navigation/actions";
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
import PostingSheriffVisibility from "ui/posting/PostingSheriffVisibility";
import PostingSubject from "ui/posting/PostingSubject";
import EntryHtml from "ui/entry/EntryHtml";
import EntryGallery from "ui/entry/EntryGallery";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";
import PostingReactions from "ui/posting/PostingReactions";
import PostingComments from "ui/posting/PostingComments";
import PostingButtons from "ui/posting/PostingButtons";
import Jump from "ui/navigation/Jump";
import "ui/posting/Posting.css";
import "ui/entry/Entry.css";

interface ContentProps {
    posting: ExtPostingInfo;
}

function Content({posting}: ContentProps) {
    const {t} = useTranslation();

    if (posting.bodyPreview != null && posting.bodyPreview.text) {
        return (
            <div className="content">
                <EntryHtml postingId={posting.id} html={posting.bodyPreview.text} nodeName="" media={posting.media}/>
                <Jump href={`/post/${posting.id}`} className="btn btn-link read-more">{t("continue-reading")}</Jump>
            </div>
        );
    } else {
        return (
            <EntryHtml className="content" postingId={posting.id} html={posting.body.previewText} nodeName=""
                       media={posting.media}/>
        );
    }
}

interface FeedPostingProps {
    posting: ExtPostingInfo;
    story: MinimalStoryInfo;
    deleting: boolean;
}

export default function FeedPosting({posting, story, deleting}: FeedPostingProps) {
    const atHome = useSelector(isAtHomeNode);
    const postingEditable = useSelector((state: ClientState) => isPermitted("edit", posting, "owner", state));
    const isSheriff = useSelector(getHomeOwnerName) === SHERIFF_GOOGLE_PLAY_TIMELINE;
    const dispatch = useDispatch();

    return (
        <div className={cx("posting entry preview", {"not-viewed": atHome && story.viewed === false})}
             data-moment={story.moment} data-viewed={story.viewed !== false}>
            {deleting ?
                <PostingDeleting/>
            :
                <>
                    <PostingMenu posting={posting} story={story}/>
                    <PostingPin pinned={story.pinned}/>
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
                    <Content posting={posting}/>
                    <EntryLinkPreviews nodeName=""
                                       linkPreviews={posting.bodyPreview?.linkPreviews ?? posting.body.linkPreviews}
                                       limit={2} media={posting.media ?? null}/>
                    <EntryGallery postingId={posting.id} nodeName="" media={posting.media ?? null}
                                  onExpand={() => dispatch(goToPosting(posting.id, null, true))}/>
                    <div className="reactions-line">
                        <PostingReactions postingId={posting.id} postingReceiverName={posting.receiverName}
                                          reactions={posting.reactions}/>
                        <PostingComments postingId={posting.id} totalComments={posting.totalComments}/>
                    </div>
                    <PostingButtons posting={posting} story={story}/>
                </>
            }
        </div>
    );
}
