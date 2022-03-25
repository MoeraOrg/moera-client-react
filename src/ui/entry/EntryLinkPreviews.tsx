import React from 'react';

import { LinkPreview, MediaAttachment } from "api/node/api-types";
import { EntryLinkPreview } from "ui/entry/EntryLinkPreview";

interface Props {
    nodeName: string | null;
    linkPreviews: (LinkPreview | null | undefined)[] | null | undefined;
    limit?: number;
    small?: boolean | null;
    media: MediaAttachment[] | null;
}

const EntryLinkPreviews = ({nodeName, linkPreviews, limit, small, media}: Props) =>
    linkPreviews != null ?
        <>
            {linkPreviews.map((linkPreview, index) =>
                (linkPreview != null && (limit == null || index < limit)) &&
                    <EntryLinkPreview key={index} nodeName={nodeName} url={linkPreview.url} title={linkPreview.title}
                                      description={linkPreview.description} imageHash={linkPreview.imageHash}
                                      siteName={linkPreview.siteName} media={media ?? null} small={small}/>
            )}
        </>
    :
        null;

export default EntryLinkPreviews;
