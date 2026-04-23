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
import { Icon, msDangerous, msDownload } from "ui/material-symbols";
import { DropdownMenu, Tooltip } from "ui/control";
import { useDispatcher, useIsTinyScreen } from "ui/hook";
import { formatFileSize } from "util/info-quantity";
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
    const tinyScreen = useIsTinyScreen();
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

    const onDownload = (file: PrivateMediaFileInfo, url: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (homeOwnerName == null || targetNodeName === homeOwnerName) {
            if (window.Android && "saveFile" in window.Android) {
                window.Android.saveFile(url, mediaFileName(file), file.mimeType);
                event.preventDefault();
            }
            return;
        }
        event.preventDefault();
        dispatch(openMediaDownloadDialog(targetNodeName, file.id));
    };

    return (
        <div>
            {files
                .map(file => {
                    const url = mediaDownloadUrl(rootPage, file, carte);
                    const fileName = mediaFileName(file);
                    const fileLabel = `${fileName}, ${formatFileSize(file.size)}`;
                    return {file, url, fileName, fileLabel};
                })
                .map(({file, url, fileName, fileLabel}) => (
                    <div className="attached-file" key={file.id}>
                        <DropdownMenu items={[
                            {
                                title: t("copy-link"),
                                nodeName,
                                href: "/media/" + file.path + "?download=true",
                                onClick: onCopyLink(file),
                                show: !file.malware
                            }
                        ]} menuContainer={document.getElementById("modal-root")}/>
                        {!file.malware ?
                            <>
                                <a className="file-name" download={fileName} href={url} title={t("download")}
                                   onClick={onDownload(file, url)}>
                                    {fileLabel}
                                </a>
                                <a className="download-icon" download={fileName} href={url} title={t("download")}
                                   onClick={onDownload(file, url)}>
                                    <Icon icon={msDownload} size="1.3em"/>
                                </a>
                            </>
                        :
                            <>
                                <div className="file-name">{fileLabel}</div>
                                <Tooltip className="malware-icon" text="malware-detected-in-file"
                                         placement={tinyScreen ? "left" : undefined}>
                                    <Icon icon={msDangerous} size="1.6em"/>
                                </Tooltip>
                            </>
                        }
                    </div>
                ))
            }
        </div>
    );
}
