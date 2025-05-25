import React from 'react';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { SearchEntryInfo } from "api";
import { ExtSearchEntryInfo } from "state/search/state";
import { AvatarWithPopup, Principal } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import StorySubject from "ui/story/StorySubject";
import StoryDate from "ui/story/StoryDate";
import EntryHtml from "ui/entry/EntryHtml";
import EntryLinkPreviews from "ui/entry/EntryLinkPreviews";
import Jump from "ui/navigation/Jump";
import { replaceEmojis } from "util/html";

interface Props {
    entry: ExtSearchEntryInfo;
}

export default function SearchEntry({entry}: Props) {
    const {t} = useTranslation();

    const href = getEntryLink(entry);
    const imagesCountHtml = entry.imageCount != null && entry.imageCount > 0
        ? replaceEmojis(t("count-images", {count: entry.imageCount}))
        : null;

    return (
        <div className="posting entry preview" data-moment={entry.moment}>
            <div className="owner-line">
                <AvatarWithPopup ownerName={entry.ownerName} ownerFullName={entry.ownerFullName}
                                 avatar={entry.ownerAvatar} size={48}/>
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
            <StorySubject subjectHtml={entry.bodyPreview.subjectHtml} nodeName={entry.nodeName} href={href}/>
            <div className="content">
                <EntryHtml html={entry.bodyPreview.text}/>
                {imagesCountHtml &&
                    <p className="search-images" dir="auto" dangerouslySetInnerHTML={{__html: imagesCountHtml}}/>
                }
                <EntryLinkPreviews nodeName={entry.nodeName} linkPreviews={entry.bodyPreview?.linkPreviews}
                                   limit={2} media={null}/>
                <Jump nodeName={entry.nodeName} href={href} className="btn btn-link read-more">
                    {tTitle(t(entry.commentId == null ? "view-post" : "view-comment"))}
                </Jump>
            </div>
        </div>
    );
}

function getEntryLink(entry: SearchEntryInfo): string {
    return entry.commentId == null ? `/post/${entry.postingId}` : `/post/${entry.postingId}?comment=${entry.commentId}`;
}
