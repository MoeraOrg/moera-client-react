import React, { MouseEventHandler, useState } from 'react';
import { useSelector } from 'react-redux';
import * as URI from 'uri-js';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { MediaAttachment, PrivateMediaFileInfo } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { Icon, msClose, msEdit } from "ui/material-symbols";
import EntryLinkPreviewImage from "ui/entry/EntryLinkPreviewImage";
import EntryLinkPreviewEditDialog, { EntryLinkPreviewEditValues } from "ui/entry/EntryLinkPreviewEditDialog";
import { interceptLinkClick } from "ui/entry/link-click-intercept";
import { ellipsize } from "util/text";
import { RelNodeName } from "util/rel-node-name";
import "./EntryLinkPreview.css";

interface Props {
    nodeName: RelNodeName | string;
    siteName?: string | null;
    url?: string | null;
    title?: string | null;
    description?: string | null;
    imageUploading?: boolean;
    imageHash?: string | null;
    media: MediaAttachment[] | null;
    small?: boolean | null;
    editing?: boolean;
    disabled?: boolean;
    onUpdate?: (title: string, description: string) => void;
    onDelete?: MouseEventHandler;
}

export function EntryLinkPreview({
    nodeName, siteName, url, title, description, imageUploading, imageHash, media, small = false, editing, disabled,
    onUpdate, onDelete
}: Props) {
    const [edit, setEdit] = useState<boolean>(false);

    if (url == null) {
        return null;
    }

    const {host} = URI.parse(url);
    if (host == null) {
        return null;
    }

    let large;
    let mediaFile: PrivateMediaFileInfo | null = null;
    if (imageHash != null && media != null) {
        mediaFile = media.find(ma => ma.media?.hash === imageHash)?.media ?? null;
        large = !small && mediaFile != null && mediaFile.width > 450;
    } else {
        large = imageUploading;
    }

    const onEdit = (e: React.MouseEvent) => {
        setEdit(true);
        e.preventDefault();
    }

    const onEditSubmit = (ok: boolean | null, values: Partial<EntryLinkPreviewEditValues>) => {
        setEdit(false);
        if (ok && onUpdate != null) {
            onUpdate(values.title ?? "", values.description ?? "");
        }
    }

    return (
        <Frame className={cx("link-preview", {large, small})} url={url}
               editing={editing && !disabled} onEdit={onEdit} onDelete={onDelete}>
            <EntryLinkPreviewImage nodeName={nodeName} mediaFile={mediaFile} loading={imageUploading ?? false}/>
            <div className="details">
                {title &&
                    <div className="title">{ellipsize(title, small ? 35 : 81)}</div>
                }
                {description &&
                    <div className="description">{ellipsize(description, small ? 70 : 120)}</div>
                }
                <div className="site">
                    {siteName &&
                        <>{ellipsize(siteName, 40)}{" "}<span className="bullet">&bull;</span>{" "}</>
                    }
                    {host.toUpperCase()}
                </div>
            </div>
            {edit &&
                <EntryLinkPreviewEditDialog title={title ?? ""} description={description ?? ""}
                                            onSubmit={onEditSubmit}/>
            }
        </Frame>
    );
}

interface FrameProps {
    editing?: boolean;
    className: string;
    url: string;
    onEdit?: MouseEventHandler;
    onDelete?: MouseEventHandler;
    children: React.ReactNode;
}

function Frame({editing, className, url, children, onEdit, onDelete}: FrameProps) {
    const openInNewWindow = useSelector((state: ClientState) => getSetting(state, "link.new-window") as boolean);
    const {t} = useTranslation();

    if (editing) {
        return (
            <div className={className} title="Edit">
                <button type="button" className="control-button edit" title={t("edit")} onClick={onEdit}>
                    <Icon icon={msEdit} size={16}/>
                </button>
                <button type="button" className="control-button delete" title={t("delete")} onClick={onDelete}>
                    <Icon icon={msClose} size={16}/>
                </button>
                {children}
            </div>
        );
    } else {
        const onClick = (event: React.MouseEvent) => interceptLinkClick(event);

        return (
            <a className={className} href={url} onClick={onClick} target={openInNewWindow ? "_blank" : undefined}
               rel="noreferrer">
                {children}
            </a>
        );
    }
}
