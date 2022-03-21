import React, { useEffect, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useField } from 'formik';

import { LinkPreviewInfo, MediaAttachment, PostingFeatures } from "api/node/api-types";
import { ClientState } from "state/state";
import { getOwnerName } from "state/owner/selectors";
import { linkPreviewImageUpload, linkPreviewLoad } from "state/linkpreviews/actions";
import { LinkPreviewsState } from "state/linkpreviews/state";
import { EntryLinkPreview } from "ui/entry/EntryLinkPreview";

type Props = {
    urlsField: string;
    nodeName?: string | null;
    features: PostingFeatures | null;
} & ConnectedProps<typeof connector>;

interface Preview {
    loading: boolean;
    info: LinkPreviewInfo;
    imageHash?: string | null;
}

function RichTextLinkPreviews({urlsField, nodeName, features, ownerName, linkPreviewsState, linkPreviewLoad,
                               linkPreviewImageUpload}: Props) {
    const [, {value: urls}] = useField<string[]>(urlsField);

    const targetNodeName = nodeName || ownerName;

    const toBeLoaded = useMemo<ToBeLoaded>(
        () => findToBeLoaded(urls, targetNodeName, linkPreviewsState),
        [urls, targetNodeName, linkPreviewsState]
    );
    useEffect(() => {
        toBeLoaded.urls.forEach(url => linkPreviewLoad(url));
        if (targetNodeName != null) {
            toBeLoaded.images.forEach(url => linkPreviewImageUpload(url, targetNodeName, features));
        }
    }, [toBeLoaded, targetNodeName, features, linkPreviewLoad, linkPreviewImageUpload]);

    if (urls.length === 0) {
        return null;
    }

    const urlSet = new Set(urls).values();
    const previews: Preview[] = [];
    const media: MediaAttachment[] = [];
    for (const url of urlSet) {
        const lpState = linkPreviewsState[url];
        if (lpState != null && lpState.loaded && lpState.info == null) {
            continue;
        }
        const imageState = targetNodeName != null && lpState != null ? lpState.images?.[targetNodeName] : null;
        if (imageState?.info != null) {
            media.push({media: imageState.info, embedded: true});
        }
        previews.push({
            loading: lpState == null || lpState.loading || imageState?.uploading === true,
            info: lpState?.info ?? {url},
            imageHash: imageState?.info?.hash
        });
    }

    return (
        <>
            {previews.map((preview, index) =>
                <EntryLinkPreview key={index} nodeName={targetNodeName} url={preview.info.url}
                                  title={preview.info.title} description={preview.info.description}
                                  imageHash={preview.imageHash} siteName={preview.info.siteName} media={media}/>
            )}
        </>
    );
}

interface ToBeLoaded {
    urls: string[];
    images: string[];
}

function findToBeLoaded(urls: string[], nodeName: string | null, linkPreviewsState: LinkPreviewsState): ToBeLoaded {
    if (nodeName == null || urls.length === 0) {
        return {urls: [], images: []};
    }

    const urlSet = new Set(urls).values();
    const loadUrls: string[] = [];
    const loadImages: string[] = [];
    for (const url of urlSet) {
        const lpState = linkPreviewsState[url];
        if (lpState == null || (!lpState.loading && !lpState.loaded)) {
            loadUrls.push(url);
        }
        if (lpState != null && lpState.loaded && lpState.info?.imageUrl != null && lpState.images?.[nodeName] == null) {
            loadImages.push(url);
        }
    }
    return {urls: loadUrls, images: loadImages};
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getOwnerName(state),
        linkPreviewsState: state.linkPreviews
    }),
    { linkPreviewLoad, linkPreviewImageUpload }
);

export default connector(RichTextLinkPreviews);
