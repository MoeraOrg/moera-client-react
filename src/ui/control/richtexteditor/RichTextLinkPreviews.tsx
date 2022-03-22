import React, { useEffect, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useField } from 'formik';
import deepEqual from 'react-fast-compare';

import { LinkPreview, MediaAttachment, PostingFeatures } from "api/node/api-types";
import { VerifiedMediaFile } from "api/node/images-upload";
import { ClientState } from "state/state";
import { getOwnerName } from "state/owner/selectors";
import { linkPreviewImageUpload, linkPreviewLoad } from "state/linkpreviews/actions";
import { LinkPreviewsState } from "state/linkpreviews/state";
import { EntryLinkPreview } from "ui/entry/EntryLinkPreview";

type Props = {
    name: string;
    urlsField: string;
    nodeName?: string | null;
    features: PostingFeatures | null;
} & ConnectedProps<typeof connector>;

export interface RichTextLinkPreviewsValue {
    previews: LinkPreview[];
    media: VerifiedMediaFile[];
}

function RichTextLinkPreviews({name, urlsField, nodeName, features, ownerName, linkPreviewsState, linkPreviewLoad,
                               linkPreviewImageUpload}: Props) {
    const [, {value}, {setValue}] = useField<RichTextLinkPreviewsValue>(name);
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

    const newValue = useMemo<RichTextLinkPreviewsValue>(
        () => buildValue(urls, targetNodeName, linkPreviewsState),
        [urls, targetNodeName, linkPreviewsState]
    );
    useEffect(() => {
        if (!deepEqual(value, newValue)) {
            setValue(newValue)
        }
    }, [newValue, value, setValue]);

    const media: MediaAttachment[] = value.media.map(media => ({media, embedded: true}));

    return (
        <>
            {value.previews.map((preview, index) =>
                <EntryLinkPreview key={index} nodeName={targetNodeName} url={preview.url} title={preview.title}
                                  description={preview.description} imageHash={preview.imageHash}
                                  siteName={preview.siteName} media={media} editing/>
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

function buildValue(urls: string[], nodeName: string | null,
                    linkPreviewsState: LinkPreviewsState): RichTextLinkPreviewsValue {
    if (urls.length === 0) {
        return {previews: [], media: []};
    }

    const urlSet = new Set(urls).values();
    const previews: LinkPreview[] = [];
    const media: VerifiedMediaFile[] = [];
    for (const url of urlSet) {
        const lpState = linkPreviewsState[url];
        if (lpState != null && lpState.loaded && lpState.info == null) {
            continue;
        }
        const imageState = nodeName != null && lpState != null ? lpState.images?.[nodeName] : null;
        if (imageState?.info != null) {
            media.push(imageState.info);
        }
        previews.push({
            siteName: lpState?.info?.siteName,
            url: lpState?.info?.url,
            title: lpState?.info?.title,
            description: lpState?.info?.description,
            imageHash: imageState?.info?.hash
        });
    }

    return {previews, media};
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getOwnerName(state),
        linkPreviewsState: state.linkPreviews
    }),
    { linkPreviewLoad, linkPreviewImageUpload }
);

export default connector(RichTextLinkPreviews);
