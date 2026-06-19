import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { PrivateMediaFileInfo, RemoteMediaInfo } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getHomeOwnerName, getRelNodeNameContext } from "state/home/selectors";
import { getRemoteMedia } from "state/remotemedia/selectors";
import { attachmentCopyLink } from "state/detailedposting/actions";
import { openMediaDownloadDialog } from "state/mediadownloaddialog/actions";
import { DropdownMenu, Tooltip } from "ui/control";
import { Icon, msDangerous, msDownload } from "ui/material-symbols";
import { useDispatcher, useIsTinyScreen } from "ui/hook";
import { absoluteNodeName, RelNodeName } from "util/rel-node-name";
import { mediaDownloadUrl, mediaFileName } from "util/media-images";
import { formatFileSize } from "util/info-quantity";
import { MediaWithCaption } from "util/media-with-caption";
import { urlWithParameters } from "util/url";

interface Props {
    nodeName: RelNodeName | string;
    mediaFile: PrivateMediaFileInfo | null;
    remoteMedia: RemoteMediaInfo | null;
}

export default function EntryFile({nodeName, mediaFile, remoteMedia}: Props) {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const targetNodeName = useSelector((state: ClientState) =>
        absoluteNodeName(nodeName, getRelNodeNameContext(state))
    );
    const actualNodeName = (mediaFile != null ? targetNodeName : remoteMedia?.nodeName) ?? targetNodeName;
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, actualNodeName));
    const remoteMediaFile = useSelector((state: ClientState) =>
        getRemoteMedia(state, remoteMedia?.nodeName, remoteMedia?.mediaId, remoteMedia?.digest)
    );
    const file = mediaFile ?? remoteMediaFile;
    const tinyScreen = useIsTinyScreen();
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const url = file != null ? mediaDownloadUrl(rootPage, file) : undefined;
    const media = new MediaWithCaption(mediaFile ?? undefined, remoteMedia ?? undefined);
    const fileName = mediaFileName(media);
    const fileLabel = media.size != null ? `${fileName}, ${formatFileSize(media.size)}` : fileName;

    const onCopyLink = () => file != null && dispatch(attachmentCopyLink(actualNodeName, file));

    const onDownload = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (media.mediaId == null || url == null) {
            event.preventDefault();
            return;
        }
        if (homeOwnerName == null || actualNodeName === homeOwnerName) {
            if (window.Android && "saveFile" in window.Android) {
                window.Android.saveFile(url, fileName, media.mimeType ?? "application/octet-stream");
                event.preventDefault();
            }
            return;
        }
        event.preventDefault();
        dispatch(openMediaDownloadDialog(actualNodeName, media.mediaId, media.grant ?? null));
    };

    return (
        <div className="attached-file">
            <DropdownMenu items={[
                {
                    title: t("copy-link"),
                    nodeName: actualNodeName,
                    href: urlWithParameters("/media/" + media.path, {download: true}),
                    onClick: onCopyLink,
                    show: !file?.malware
                }
            ]} menuContainer={document.getElementById("modal-root")}/>
            {!file?.malware ?
                <>
                    <a className="file-name" download={fileName} href={url} title={t("download")}
                       onClick={onDownload}>
                        {fileLabel}
                    </a>
                    <a className="download-icon" download={fileName} href={url} title={t("download")}
                       onClick={onDownload}>
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
    )
}
