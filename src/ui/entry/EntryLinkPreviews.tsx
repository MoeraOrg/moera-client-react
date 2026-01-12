import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LinkPreview, MediaAttachment } from "api";
import { EntryLinkPreview } from "ui/entry/EntryLinkPreview";
import "./EntryLinkPreviews.css";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    nodeName: RelNodeName | string;
    linkPreviews: (LinkPreview | null | undefined)[] | null | undefined;
    limit?: number;
    small?: boolean | null;
    media: MediaAttachment[] | null;
}

export default function EntryLinkPreviews({nodeName, linkPreviews, limit, small, media}: Props) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const {t} = useTranslation();

    if (linkPreviews == null) {
        return null;
    }

    const onExpand = (e: React.MouseEvent) => {
        setExpanded(!expanded);
        e.preventDefault();
    };

    const max = expanded ? null : limit;

    return (
        <>
            {linkPreviews.map((linkPreview, index) =>
                (linkPreview != null && (max == null || index < max)) &&
                    <EntryLinkPreview
                        key={index}
                        nodeName={nodeName}
                        url={linkPreview.url}
                        title={linkPreview.title}
                        description={linkPreview.description}
                        imageHash={linkPreview.imageHash}
                        siteName={linkPreview.siteName}
                        media={media ?? null}
                        small={small}
                    />
            )}
            {(limit != null && linkPreviews.length > limit) &&
                <>
                    <br/>
                    <button className="entry-link-previews-expand" onClick={onExpand}>
                        {max != null ? "+" : "-"}{t("more-links", {count: linkPreviews.length - 2})}
                    </button>
                </>
            }
        </>
    );
}
