import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { PrivateMediaFileInfo } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import PreloadedImage from "ui/posting/PreloadedImage";
import { Loading } from 'ui/control';
import { useIsTinyScreen } from "ui/hook/media-query";
import { mediaImageTagAttributes } from "util/media-images";
import { RelNodeName } from "util/rel-node-name";
import "./EntryLinkPreviewImage.css";

interface Props {
    nodeName: RelNodeName | string;
    mediaFile?: PrivateMediaFileInfo | null;
    loading: boolean;
}

export default function EntryLinkPreviewImage({nodeName, mediaFile, loading}: Props) {
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, nodeName));
    const carte = useSelector(getCurrentViewMediaCarte);
    const tinyScreen = useIsTinyScreen();
    const {t} = useTranslation();

    if (mediaFile == null) {
        if (loading) {
            return <div className="image-loading">{t("loading-preview")} <Loading/></div>;
        }
        return null;
    }

    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt
    } = mediaImageTagAttributes(rootPage, mediaFile, carte, 800);

    const vertical = tinyScreen ? imageHeight > imageWidth * 0.55 : imageHeight > imageWidth;

    return (
        <PreloadedImage src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight} alt={alt}
                        className={vertical ? "vertical" : undefined}/>
    );
}
