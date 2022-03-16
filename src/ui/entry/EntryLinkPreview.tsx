import React from 'react';
import * as URI from 'uri-js';

import { LinkPreview, MediaAttachment } from "api/node/api-types";
import EntryLinkPreviewImage from "ui/entry/EntryLinkPreviewImage";
import { ellipsize } from "util/text";
import "./EntryLinkPreview.css";

interface Props {
    nodeName: string | null;
    linkPreview: LinkPreview | null | undefined;
    media: MediaAttachment[] | null;
}

export function EntryLinkPreview({nodeName, linkPreview, media}: Props) {
    if (linkPreview == null || linkPreview.url == null) {
        return null;
    }

    const {host} = URI.parse(linkPreview.url);
    if (host == null) {
        return null;
    }

    return (
        <a className="link-preview" href={linkPreview.url}>
            <EntryLinkPreviewImage nodeName={nodeName} hash={linkPreview.imageHash} media={media}/>
            <div className="details">
                {linkPreview.title &&
                    <div className="title">{ellipsize(linkPreview.title, 75)}</div>
                }
                {linkPreview.description &&
                    <div className="description">{ellipsize(linkPreview.description, 170)}</div>
                }
                <div className="site">
                    {linkPreview.siteName &&
                        <>{ellipsize(linkPreview.siteName, 40)}<span className="bullet">&bull;</span></>
                    }
                    {host.toUpperCase()}
                </div>
            </div>
        </a>
    );
}
