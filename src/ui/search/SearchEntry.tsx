import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { tTitle } from "i18n";
import { SearchEntryInfo } from "api";
import { ExtSearchEntryInfo } from "state/search/state";
import { AvatarWithPopup, Principal } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import StorySubject from "ui/story/StorySubject";
import StoryDate from "ui/story/StoryDate";
import EntryHtml from "ui/entry/EntryHtml";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";
import CommentDate from "ui/comment/CommentDate";
import SearchEntryImagePreview from "ui/search/SearchEntryImagePreview";
import SearchEntryMenu from "ui/search/SearchEntryMenu";
import Jump from "ui/navigation/Jump";
import { replaceEmojis } from "util/html";
import { REL_SEARCH } from "util/rel-node-name";
import { ut } from "util/url";

interface PostingOwnerLineProps {
    entry: ExtSearchEntryInfo;
    href: string;
}

const PostingOwnerLine = ({entry, href}: PostingOwnerLineProps) => (
    <div className="owner-line">
        <AvatarWithPopup
            ownerName={entry.ownerName}
            ownerFullName={entry.ownerFullName}
            nodeName={REL_SEARCH}
            avatar={entry.ownerAvatar}
            size={40}
        />
        <div className="owner-info">
            <span className="owner">
                <NodeName name={entry.ownerName} fullName={entry.ownerFullName} avatar={entry.ownerAvatar}/>
            </span>
            <br/>
            <StoryDate publishedAt={entry.createdAt} nodeName={entry.nodeName} href={href}/>
            <span className="visibility">
                &middot;
                <Principal value={entry.operations?.view ?? "public"}/>
            </span>
        </div>
    </div>
);

interface CommentOwnerLineProps {
    entry: ExtSearchEntryInfo;
}

const CommentOwnerLine = ({entry}: CommentOwnerLineProps) => (
    <div className="owner-line">
        <span>
            <AvatarWithPopup
                ownerName={entry.ownerName}
                ownerFullName={entry.ownerFullName}
                nodeName={REL_SEARCH}
                avatar={entry.ownerAvatar}
                size={32}
            />
            <span className="owner">
                <NodeName name={entry.ownerName} fullName={entry.ownerFullName} avatar={entry.ownerAvatar}/>
            </span>
        </span>
        <span>
            <span className="visibility">
                <Principal value={entry.operations?.view ?? "public"}/>
                &middot;
            </span>
            <CommentDate
                createdAt={entry.createdAt}
                nodeName={entry.nodeName}
                postingId={entry.postingId}
                commentId={entry.commentId ?? ""}
            />
        </span>
    </div>
);

interface Props {
    entry: ExtSearchEntryInfo;
}

export default function SearchEntry({entry}: Props) {
    const {t} = useTranslation();

    const href = getEntryLink(entry);

    return (
        <div
            className={cx(
                "entry",
                {"posting preview": entry.commentId == null, "comment comment-panel": entry.commentId != null}
            )}
            data-moment={entry.moment}
        >
            <SearchEntryMenu entry={entry}/>
            {entry.commentId == null ?
                <PostingOwnerLine entry={entry} href={href}/>
            :
                <CommentOwnerLine entry={entry}/>
            }
            <StorySubject subjectHtml={entry.bodyPreview.subjectHtml} nodeName={entry.nodeName} href={href}/>
            <div className="content pb-0">
                <EntryHtml html={entry.bodyPreview.text}/>
                {entry.imageCount != null && entry.imageCount > 0 &&
                    <p className="search-images" dir="auto">
                        {entry.mediaPreviewId != null && entry.mediaPreview != null ?
                            <>
                                <SearchEntryImagePreview
                                    nodeName={entry.nodeName}
                                    postingId={entry.postingId}
                                    commentId={entry.commentId}
                                    mediaId={entry.mediaPreviewId}
                                    mediaFile={entry.mediaPreview}
                                />
                                {entry.imageCount > 1 ? t("count-images", {count: entry.imageCount}) : ""}
                            </>
                        :
                            <span dangerouslySetInnerHTML={{
                                __html: replaceEmojis("\uD83D\uDDBC️" + t("count-images", {count: entry.imageCount}))
                            }}/>
                        }
                    </p>
                }
                <EntryLinkPreviews
                    nodeName={entry.nodeName}
                    linkPreviews={entry.bodyPreview?.linkPreviews}
                    noFollow={false}
                    limit={2}
                    media={null}
                />
                <Jump nodeName={entry.nodeName} href={href} className="btn btn-link read-more">
                    {tTitle(t(entry.commentId == null ? "view-post" : "view-comment"))}
                </Jump>
            </div>
        </div>
    );
}

function getEntryLink(entry: SearchEntryInfo): string {
    return entry.commentId == null
        ? ut`/post/${entry.postingId}`
        : ut`/post/${entry.postingId}?comment=${entry.commentId}`;
}
