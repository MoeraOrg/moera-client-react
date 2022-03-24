import React, { MouseEventHandler } from 'react';
import * as URI from 'uri-js';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MediaAttachment, PrivateMediaFileInfo } from "api/node/api-types";
import { DeleteButton } from "ui/control";
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
    editing?: boolean;
    onDelete?: MouseEventHandler;
}

export function EntryLinkPreview({nodeName, siteName, url, title, description, imageHash, media, editing,
                                  onDelete}: Props) {
    if (url == null) {
        return null;
    }

    const {host} = URI.parse(url);
    if (host == null) {
        return null;
    }

    let large = false;
    let mediaFile: PrivateMediaFileInfo | null = null;
    if (imageHash != null && media != null) {
        mediaFile = media.find(ma => ma.media?.hash === imageHash)?.media ?? null;
        large = mediaFile != null && mediaFile.width > 450;
    }

    return (
        <Frame className={cx("link-preview", {"large": large})} url={url} editing={editing} onDelete={onDelete}>
            <EntryLinkPreviewImage nodeName={nodeName} mediaFile={mediaFile}/>
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
        </Frame>
    );
}

interface FrameProps {
    editing?: boolean;
    className: string;
    url: string;
    onDelete?: MouseEventHandler;
    children: React.ReactNode;
}

function Frame({editing, className, url, children, onDelete}: FrameProps) {
    if (editing) {
        return (
            <div className={className} title="Edit">
                <DeleteButton onClick={onDelete}/>
                <EditButton onClick={onDelete}/>
                {children}
            </div>
        );
    } else {
        return (
            <a className={className} href={url}>{children}</a>
        );
    }
}

interface EditButtonProps {
    onClick?: MouseEventHandler;
}

export const EditButton = ({onClick}: EditButtonProps) => (
    <div className="edit-button" title="Edit" onClick={onClick}>
        <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon="circle"/>
            <span className="pen"><FontAwesomeIcon icon="pen" color="white"/></span>
        </span>
    </div>
);
