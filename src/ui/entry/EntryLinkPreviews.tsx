import React from 'react';

import { LinkPreview, MediaAttachment } from "api/node/api-types";
import { EntryLinkPreview } from "ui/entry/EntryLinkPreview";

interface Props {
    nodeName: string | null;
    linkPreviews: LinkPreview[] | null | undefined;
    limit?: number;
    media: MediaAttachment[] | null;
}

const EntryLinkPreviews = ({nodeName, linkPreviews, limit, media}: Props) =>
    linkPreviews != null ?
        <>
            {linkPreviews.map((linkPreview, index) =>
                (limit == null || index < limit) &&
                    <EntryLinkPreview key={index} nodeName={nodeName} linkPreview={linkPreview} media={media ?? null}/>
            )}
        </>
    :
        null;

export default EntryLinkPreviews;
