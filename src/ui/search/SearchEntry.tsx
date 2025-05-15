import React from 'react';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { SearchEntryInfo } from "api";
import { AvatarWithPopup, Principal } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import StoryDate from "ui/story/StoryDate";
import EntryHtml from "ui/entry/EntryHtml";
import Jump from "ui/navigation/Jump";

interface Props {
    entry: SearchEntryInfo;
}

export default function SearchEntry({entry}: Props) {
    const {t} = useTranslation();

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
                    <StoryDate publishedAt={entry.createdAt} nodeName={entry.nodeName} href={getEntryLink(entry)}/>
                    <span className="visibility">
                        &middot;
                        <Principal value={entry.operations?.view ?? "public"}/>
                    </span>
                </div>
            </div>
            <div className="content">
                <EntryHtml html={entry.bodyPreview.text}/>
                <Jump nodeName={entry.nodeName} href={getEntryLink(entry)} className="btn btn-link read-more">
                    {tTitle(t(entry.commentId == null ? "view-post" : "view-comment"))}
                </Jump>
            </div>
        </div>
    );
}

function getEntryLink(entry: SearchEntryInfo): string {
    return entry.commentId == null ? `/post/${entry.postingId}` : `/post/${entry.postingId}?comment=${entry.commentId}`;
}
