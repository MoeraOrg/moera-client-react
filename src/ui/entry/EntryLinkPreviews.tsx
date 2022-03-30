import React, { useState } from 'react';

import { LinkPreview, MediaAttachment } from "api/node/api-types";
import { EntryLinkPreview } from "ui/entry/EntryLinkPreview";
import "./EntryLinkPreviews.css";

interface Props {
    nodeName: string | null;
    linkPreviews: (LinkPreview | null | undefined)[] | null | undefined;
    limit?: number;
    small?: boolean | null;
    media: MediaAttachment[] | null;
}

export default function EntryLinkPreviews({nodeName, linkPreviews, limit, small, media}: Props) {
    const [expanded, setExpanded] = useState<boolean>(false);

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
                    <EntryLinkPreview key={index} nodeName={nodeName} url={linkPreview.url} title={linkPreview.title}
                                      description={linkPreview.description} imageHash={linkPreview.imageHash}
                                      siteName={linkPreview.siteName} media={media ?? null} small={small}/>
            )}
            {(linkPreviews.length > 2) &&
                <>
                    <br/>
                    <button className="entry-link-previews-expand" onClick={onExpand}>
                        {max != null ? "+" : "-"}{linkPreviews.length - 2}
                        {linkPreviews.length === 3 ? " link" : " links"}
                    </button>
                </>
            }
        </>
    );
}
