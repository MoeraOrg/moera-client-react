import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { PrivateMediaFileInfo } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import PreloadedImage from "ui/posting/PreloadedImage";
import * as Browser from "ui/browser";
import { Loading } from 'ui/control';
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
    const {t} = useTranslation();

    if (mediaFile == null) {
        if (loading) {
            return <div className="image-loading">{t("loading-preview")} <Loading/></div>;
        }
        return null;
    }

    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight
    } = mediaImageTagAttributes(rootPage, mediaFile, carte, 800);

    const vertical = Browser.isTinyScreen() ? imageHeight > imageWidth * 0.55 : imageHeight > imageWidth;

    return (
        <PreloadedImage src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight}
                        className={vertical ? "vertical" : undefined}/>
    );
}
