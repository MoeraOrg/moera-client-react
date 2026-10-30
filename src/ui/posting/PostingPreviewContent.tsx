import React from 'react';
import { useTranslation } from 'react-i18next';

import { ExtPostingInfo } from "state/postings/state";
import EntryHtml from "ui/entry/EntryHtml";
import Jump from "ui/navigation/Jump";
import { RelNodeName } from "util/rel-node-name";
import { ut } from "util/url";

interface Props {
    nodeName: RelNodeName | string;
    posting: ExtPostingInfo;
}

export default function PostingPreviewContent({nodeName, posting}: Props) {
    const {t} = useTranslation();

    if (posting.bodyPreview?.text) {
        return (
            <div className="content">
                <EntryHtml
                    postingId={posting.id}
                    html={posting.bodyPreview.text}
                    nodeName={nodeName}
                    media={posting.media}
                />
                <Jump href={ut`/post/${posting.id}`} className="btn btn-link read-more">{t("continue-reading")}</Jump>
            </div>
        );
    } else {
        return (
            <EntryHtml
                className="content"
                postingId={posting.id}
                html={posting.body.previewText}
                nodeName={nodeName}
                media={posting.media}
            />
        );
    }
}
