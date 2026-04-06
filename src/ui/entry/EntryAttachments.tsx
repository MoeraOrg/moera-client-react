import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { MediaAttachment, PrivateMediaFileInfo } from "api";
import { getHomeOwnerName, getRelNodeNameContext } from "state/home/selectors";
import { openMediaDownloadDialog } from "state/mediadownloaddialog/actions";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { attachmentCopyLink } from "state/detailedposting/actions";
import { Icon, msDownload } from "ui/material-symbols";
import { DropdownMenu } from "ui/control";
import { useDispatcher } from "ui/hook";
import { mediaDownloadUrl, mediaFileName } from "util/media-images";
import { absoluteNodeName, RelNodeName } from "util/rel-node-name";
import { notNull } from "util/misc";
import "./EntryAttachments.css";

interface Props {
    nodeName: string | RelNodeName;
    media: MediaAttachment[] | null;
}

export default function EntryAttachments({nodeName, media}: Props) {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const targetNodeName = useSelector((state: ClientState) =>
        absoluteNodeName(nodeName, getRelNodeNameContext(state))
    );
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, nodeName));
    const carte = useSelector(getCurrentViewMediaCarte);
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    if (media == null || media.length === 0) {
        return null;
    }

    const files = media
        .map(ma => ma.media)
        .filter(notNull)
        .filter(m => m.attachment);
    if (files.length === 0) {
        return null;
    }

    const onCopyLink = (file: PrivateMediaFileInfo) => () =>
        dispatch(attachmentCopyLink(nodeName, file));

    const onDownload = (file: PrivateMediaFileInfo) => (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (targetNodeName === homeOwnerName) {
            return;
        }
        event.preventDefault();
        dispatch(openMediaDownloadDialog(targetNodeName, file.id));
    };

    return (
        <div>
            {files
                .map(file => ({file, url: mediaDownloadUrl(rootPage, file, carte)}))
                .map(({file, url}) => (
                    <div className="attached-file" key={file.id}>
                        <DropdownMenu items={[
                            {
                                title: t("copy-link"),
                                nodeName,
                                href: "/media/" + file.path + "?download=true",
                                onClick: onCopyLink(file),
                                show: true
                            }
                        ]} menuContainer={document.getElementById("modal-root")}/>
                        <a className="file-name" download href={url} title={t("download")} onClick={onDownload(file)}>
                            {mediaFileName(file)}
                        </a>
                        <a className="download-icon" download href={url} title={t("download")}
                           onClick={onDownload(file)}>
                            <Icon icon={msDownload} size="1.3em"/>
                        </a>
                    </div>
                ))
            }
        </div>
    );
}
