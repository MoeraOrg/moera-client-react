import React, { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { LinkPreview } from "api";
import { ExtPostingInfo } from "state/postings/state";
import { getPosting } from "state/postings/selectors";
import { ClientState } from "state/state";
import { Icon, msClose } from "ui/material-symbols";
import PostingAvatar from "ui/posting/PostingAvatar";
import PostingOwner from "ui/posting/PostingOwner";
import PostingDate from "ui/posting/PostingDate";
import PostingUpdated from "ui/posting/PostingUpdated";
import PostingVisibility from "ui/posting/PostingVisibility";
import PostingSubject from "ui/posting/PostingSubject";
import PostingPreviewContent from "ui/posting/PostingPreviewContent";
import EntryAttachments from "ui/entry/EntryAttachments";
import EntryGallery from "ui/entry/EntryGallery";
import { parseUniversalPostingUrl } from "util/universal-url";
import { now } from "util/misc";
import "./LinkedPosting.css";

interface Props {
    preview: LinkPreview;
    compact?: boolean;
    editing?: boolean;
    disabled?: boolean;
    onDelete?: MouseEventHandler;
}

export default function LinkedPosting({preview, compact, editing, disabled, onDelete}: Props) {
    const remotePosting = parseUniversalPostingUrl(preview.url);
    const cachedPosting = useSelector((state: ClientState) =>
        !compact && remotePosting != null ? getPosting(state, remotePosting.postingId, remotePosting.nodeName) : null
    );
    const {t} = useTranslation();

    if (remotePosting == null) {
        return null;
    }

    const {nodeName, postingId} = remotePosting;
    const posting = cachedPosting == null || compact ? previewToPosting(postingId, preview) : cachedPosting;

    if (posting == null) {
        return null;
    }

    return (
        <div className="linked-posting posting entry preview">
            {editing && !disabled &&
                <button type="button" className="delete-button" title={t("delete")} onClick={onDelete}>
                    <Icon icon={msClose} size={16}/>
                </button>
            }
            <div className="owner-line">
                <PostingAvatar posting={posting}/>
                <div className="owner-info">
                    <PostingOwner posting={posting}/>
                    <br/>
                    <PostingDate posting={posting}/>
                    {posting.totalRevisions > 1 &&
                        <PostingUpdated
                            createdAt={posting.createdAt}
                            editedAt={posting.editedAt}
                            publishedAt={posting.createdAt}
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
            />
        </div>
    );
}

function previewToPosting(postingId: string, preview: LinkPreview): ExtPostingInfo | null {
    if (preview.ownerName == null) {
        return null;
    }

    return {
        id: postingId,
        revisionId: "",
        totalRevisions: 1,
        ownerName: preview.ownerName,
        ownerFullName: preview.ownerFullName,
        ownerSourceUri: preview.ownerSourceUri,
        ownerAvatar: preview.ownerAvatar,
        createdAt: preview.publishedAt ?? now(),
        revisionCreatedAt: preview.publishedAt ?? now(),
        heading: preview.description ?? "",
        bodySrcHash: "",
        body: {
            previewText: `<p>${preview.description}</p>`
        }
    };
}
