import React from 'react';
import * as URI from 'uri-js';

import { MediaAttachment } from "api/node/api-types";
import EntryLinkPreviewImage from "ui/entry/EntryLinkPreviewImage";
import { ellipsize } from "util/text";
import "./EntryLinkPreview.css";

interface Props {
    nodeName: string | null;
    siteName?: string | null;
    url?: string | null;
    title?: string | null;
    description?: string | null;
    imageHash?: string | null;
    media: MediaAttachment[] | null;
}

export function EntryLinkPreview({nodeName, siteName, url, title, description, imageHash, media}: Props) {
    if (url == null) {
        return null;
    }

    const {host} = URI.parse(url);
    if (host == null) {
        return null;
    }

    return (
        <a className="link-preview" href={url}>
            <EntryLinkPreviewImage nodeName={nodeName} hash={imageHash} media={media}/>
            <div className="details">
                {title &&
                    <div className="title">{ellipsize(title, 75)}</div>
                }
                {description &&
                    <div className="description">{ellipsize(description, 120)}</div>
                }
                <div className="site">
                    {siteName &&
                        <>{ellipsize(siteName, 40)}<span className="bullet">&bull;</span></>
                    }
                    {host.toUpperCase()}
                </div>
            </div>
        </a>
    );
}
