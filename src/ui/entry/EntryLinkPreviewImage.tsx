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
import {
    mediaImageFindLargerPreview,
    mediaImagePreview,
    mediaImageSize,
    mediaSizes,
    mediaSources
} from "util/media-images";
import { RelNodeName } from "util/rel-node-name";
import { urlWithParameters } from "util/url";
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

    const mediaPrefix = rootPage + "/media/";
    let mediaLocation: string;
    let src: string;
    if (mediaFile.directPath) {
        mediaLocation = mediaPrefix + mediaFile.directPath;
        const preview = mediaImageFindLargerPreview(mediaFile.previews, 800);
        src = rootPage + "/media/" + preview?.directPath ?? mediaFile.directPath;
    } else {
        const isPublic = (mediaFile.operations?.view ?? "public") === "public";
        const auth = !isPublic && carte != null ? "carte:" + carte : null;
        mediaLocation = urlWithParameters(mediaPrefix + mediaFile.path, {auth});
        src = mediaImagePreview(mediaLocation, 800);
    }
    const srcSet = mediaSources(mediaLocation, mediaPrefix, mediaFile.previews);
    const sizes = mediaSizes(mediaFile.previews ?? []);
    const [imageWidth, imageHeight] = mediaImageSize(800, null, null, mediaFile, false);
    const vertical = Browser.isTinyScreen() ? imageHeight > imageWidth * 0.55 : imageHeight > imageWidth;

    return (
        <PreloadedImage src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight}
                        className={vertical ? "vertical" : undefined}/>
    );
}
