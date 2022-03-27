import React, { useEffect, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useField } from 'formik';
import deepEqual from 'react-fast-compare';
import * as immutable from 'object-path-immutable';

import { LinkPreview, MediaAttachment, PostingFeatures } from "api/node/api-types";
import { VerifiedMediaFile } from "api/node/images-upload";
import { ClientState } from "state/state";
import { getOwnerName } from "state/owner/selectors";
import { linkPreviewImageUpload, linkPreviewLoad } from "state/linkpreviews/actions";
import { LinkPreviewsState } from "state/linkpreviews/state";
import { EntryLinkPreview } from "ui/entry/EntryLinkPreview";
import EntryLinkSelector from "ui/entry/EntryLinkSelector";
import { extractUrls } from "util/text";

type Props = {
    name: string;
    urlsField: string;
    nodeName?: string | null;
    features: PostingFeatures | null;
    small?: boolean | null;
} & ConnectedProps<typeof connector>;

type RichTextLinkPreviewStatus = "deleted" | "edited" | null;

export type RichTextLinkPreviewsStatus = Partial<Record<string, RichTextLinkPreviewStatus>>;

export interface RichTextLinkPreviewsValue {
    previews: LinkPreview[];
    media: VerifiedMediaFile[];
    status: RichTextLinkPreviewsStatus;
}

export function bodyToLinkPreviews(body: string,
                                   linkPreviewsInfo: LinkPreview[],
                                   media: VerifiedMediaFile[]): [RichTextLinkPreviewsValue,
                                                                 string[],
                                                                 VerifiedMediaFile[]] {
    const bodyUrls = extractUrls(body);
    const linkPreviewsUrls = new Set(linkPreviewsInfo.map(lp => lp.url));
    const linkPreviewsImages = new Set(
        linkPreviewsInfo.map(lp => lp.imageHash).filter((ih): ih is string => ih != null)
    );
    const linkPreviewsStatus: RichTextLinkPreviewsStatus = {};
    for (const url of bodyUrls) {
        linkPreviewsStatus[url] = linkPreviewsUrls.has(url) ? "edited" : "deleted";
    }
    const linkPreviews = {
        previews: linkPreviewsInfo,
        media: media.filter(mf => linkPreviewsImages.has(mf.hash)),
        status: linkPreviewsStatus
    };
    media = media.filter(mf => !linkPreviewsImages.has(mf.hash));
    return [linkPreviews, bodyUrls, media];
}

function RichTextLinkPreviews({name, urlsField, nodeName, features, small, ownerName, linkPreviewsState,
                               linkPreviewLoad, linkPreviewImageUpload}: Props) {
    const [, {value}, {setValue}] = useField<RichTextLinkPreviewsValue>(name);
    const [, {value: urls}] = useField<string[]>(urlsField);

    const targetNodeName = nodeName || ownerName;

    const {urlsToLoad, imagesToLoad, value: newValue} = useMemo<ValueChange>(
        () => buildValue(urls, targetNodeName, linkPreviewsState, value),
        [urls, targetNodeName, linkPreviewsState, value]
    );
    useEffect(() => {
        urlsToLoad.forEach(url => linkPreviewLoad(url));
        if (targetNodeName != null) {
            imagesToLoad.forEach(url => linkPreviewImageUpload(url, targetNodeName, features));
        }
        if (!deepEqual(value, newValue)) {
            setValue(newValue)
        }
    }, [urlsToLoad, imagesToLoad, newValue, value, setValue, targetNodeName, linkPreviewLoad, linkPreviewImageUpload,
        features]);

    const onUpdate = (url: string | null | undefined) => (title: string, description: string) => {
        if (url == null) {
            return;
        }
        const index = value.previews.findIndex(lp => lp.url === url);
        if (index < 0) {
            return;
        }
        setValue(immutable.wrap(value)
            .set(["status", url], "edited")
            .assign(["previews", index], {title, description})
            .value());
    }

    const onDelete = (url: string | null | undefined) => () => {
        if (url != null) {
            setValue(immutable.set(value, ["status", url], "deleted"));
        }
    }

    const onRestore = (url: string) =>
        setValue(immutable.del(value, ["status", url]));

    const media: MediaAttachment[] = value.media.map(media => ({media, embedded: true}));

    return (
        <>
            <EntryLinkSelector urls={urls.filter(url => value.status[url] === "deleted")} onSelect={onRestore}/>
            {value.previews.map((preview, index) =>
                <EntryLinkPreview key={index} nodeName={targetNodeName} url={preview.url} title={preview.title}
                                  description={preview.description} imageHash={preview.imageHash}
                                  siteName={preview.siteName} media={media} small={small} editing
                                  onUpdate={onUpdate(preview.url)} onDelete={onDelete(preview.url)}/>
            )}
        </>
    );
}

interface ValueChange {
    urlsToLoad: string[];
    imagesToLoad: string[];
    value: RichTextLinkPreviewsValue;
}

function buildValue(urls: string[], nodeName: string | null,
                    linkPreviewsState: LinkPreviewsState,
                    value: RichTextLinkPreviewsValue): ValueChange {
    if (nodeName == null || urls.length === 0) {
        return {urlsToLoad: [], imagesToLoad: [], value: {previews: [], media: [], status: value.status}};
    }

    const urlSet = new Set(urls).values();
    const loadUrls: string[] = [];
    const loadImages: string[] = [];
    const previews: LinkPreview[] = [];
    const media: VerifiedMediaFile[] = [];
    for (const url of urlSet) {
        if (value.status[url] === "deleted") {
            continue;
        }

        if (value.status[url] === "edited") {
            const preview = value.previews.find(p => p.url === url);
            if (preview != null) {
                previews.push(preview);
                const mediaFile = value.media.find(m => m.hash === preview.imageHash);
                if (mediaFile != null) {
                    media.push(mediaFile);
                }
            }
            continue;
        }

        const lpState = linkPreviewsState[url];
        if (lpState == null || (!lpState.loading && !lpState.loaded)) {
            loadUrls.push(url);
        }
        if (lpState != null && lpState.loaded) {
            if (lpState.info == null) {
                continue;
            }
            if (lpState.info.imageUrl != null && lpState.images?.[nodeName] == null) {
                loadImages.push(url);
            }
        }
        const imageState = lpState != null ? lpState.images?.[nodeName] : null;
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

    return {urlsToLoad: loadUrls, imagesToLoad: loadImages, value: {previews, media, status: value.status}};
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getOwnerName(state),
        linkPreviewsState: state.linkPreviews
    }),
    { linkPreviewLoad, linkPreviewImageUpload }
);

export default connector(RichTextLinkPreviews);
