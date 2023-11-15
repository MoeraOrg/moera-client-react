import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { PrivateMediaFileInfo } from "api";
import { ClientState } from "state/state";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import PreloadedImage from "ui/posting/PreloadedImage";
import { Browser } from "ui/browser";
import { Loading } from 'ui/control';
import { mediaImagePreview, mediaImageSize, mediaSizes, mediaSources } from "util/media-images";
import { urlWithParameters } from "util/url";
import "./EntryLinkPreviewImage.css";

interface OwnProps {
    nodeName: string | null;
    mediaFile?: PrivateMediaFileInfo | null;
    loading: boolean;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function EntryLinkPreviewImage({mediaFile, loading, rootPage, carte}: Props) {
    const {t} = useTranslation();

    if (mediaFile == null) {
        if (loading) {
            return <div className="image-loading">{t("loading-preview")} <Loading/></div>;
        }
        return null;
    }

    const isPublic = (mediaFile.operations?.view ?? "public") === "public";
    const auth = !isPublic && carte != null ? "carte:" + carte : null;
    const mediaLocation = urlWithParameters(rootPage + "/media/" + mediaFile.path, {auth});
    const src = mediaImagePreview(mediaLocation, 800);
    const srcSet = mediaSources(mediaLocation, mediaFile.previews);
    const sizes = mediaSizes(mediaFile.previews ?? []);
    const [imageWidth, imageHeight] = mediaImageSize(800, null, null, mediaFile);
    const vertical = Browser.isTinyScreen() ? imageHeight > imageWidth * 0.55 : imageHeight > imageWidth;

    return (
        <PreloadedImage src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight}
                        className={vertical ? "vertical" : undefined}/>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        rootPage: props.nodeName ? getNamingNameNodeUri(state, props.nodeName) : getNodeRootPage(state),
        carte: getCurrentViewMediaCarte(state)
    })
);

export default connector(EntryLinkPreviewImage);
