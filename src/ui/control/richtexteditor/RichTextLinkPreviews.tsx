import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useField } from 'formik';
import deepEqual from 'react-fast-compare';
import * as immutable from 'object-path-immutable';
import * as URI from 'uri-js';

import { LinkPreview, MediaAttachment, PostingFeatures, VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { getRelNodeNameContext } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { linkPreviewImageUpload, linkPreviewLoad } from "state/linkpreviews/actions";
import { LinkPreviewsState } from "state/linkpreviews/state";
import { EntryLinkPreview } from "ui/entry/EntryLinkPreview";
import EntryLinkSelector from "ui/entry/EntryLinkSelector";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import { scriptureExtractUrls } from "ui/control/richtexteditor/visual/scripture-editor";
import { extractUrls } from "util/text";
import { absoluteNodeName, RelNodeName } from "util/rel-node-name";
import { notNull } from "util/misc";

interface Props {
    name: string;
    urlsField: string;
    nodeName: RelNodeName | string;
    features?: PostingFeatures | null;
    small?: boolean | null;
    disabled?: boolean;
}

type RichTextLinkPreviewStatus = "deleted" | "edited" | "loaded" | null;

export type RichTextLinkPreviewsStatus = Partial<Record<string, RichTextLinkPreviewStatus>>;

export interface RichTextLinkPreviewsValue {
    previews: LinkPreview[];
    media: VerifiedMediaFile[];
    status: RichTextLinkPreviewsStatus;
}

export function bodyToLinkPreviews(
    body: string | Scripture, linkPreviewsInfo: LinkPreview[], media: VerifiedMediaFile[]
): [RichTextLinkPreviewsValue, string[], VerifiedMediaFile[]] {
    const bodyUrls = typeof body !== "string" ? scriptureExtractUrls(body) : extractUrls(body);
    const linkPreviewsUrls = new Set(linkPreviewsInfo.map(lp => lp.url));
    const linkPreviewsImages = new Set(
        linkPreviewsInfo.map(lp => lp.imageHash).filter(notNull)
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

export default function RichTextLinkPreviews({name, urlsField, nodeName, features, small, disabled}: Props) {
    const nodeNameContext = useSelector(getRelNodeNameContext);
    const linkPreviewsState = useSelector((state: ClientState) => state.linkPreviews);
    const maxAutomatic = useSelector((state: ClientState) =>
        getSetting(state, "rich-text-editor.link-previews.max-automatic") as number);
    const dispatch = useDispatch();

    const [, {value}, {setValue}] = useField<RichTextLinkPreviewsValue>(name);
    const [, {value: urls}] = useField<string[]>(urlsField);

    const targetNodeName = absoluteNodeName(nodeName, nodeNameContext);

    const {urlsToLoad, imagesToLoad, value: newValue} = useMemo<ValueChange>(
        () => buildValue(urls, targetNodeName, linkPreviewsState, value, maxAutomatic),
        [urls, targetNodeName, linkPreviewsState, value, maxAutomatic]
    );
    useEffect(() => {
        urlsToLoad.forEach(url => dispatch(linkPreviewLoad(url)));
        if (targetNodeName != null) {
            imagesToLoad.forEach(url => dispatch(linkPreviewImageUpload(url, targetNodeName, features ?? null)));
        }
        if (!deepEqual(value, newValue)) {
            setValue(newValue)
        }
    }, [urlsToLoad, imagesToLoad, newValue, value, setValue, targetNodeName, dispatch, features]);

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
        setValue(immutable.set(value, ["status", url], "loaded"));

    const media: MediaAttachment[] = value.media.map(media => ({media, embedded: true}));

    return (
        <div className="mt-3">
            <EntryLinkSelector urls={urls.filter(url => value.status[url] === "deleted")} onSelect={onRestore}
                               disabled={disabled}/>
            {value.previews.map((preview, index) =>
                <EntryLinkPreview key={index} nodeName={targetNodeName} url={preview.url} title={preview.title}
                                  description={preview.description}
                                  imageUploading={isImageUploading(linkPreviewsState, preview.url, targetNodeName)}
                                  imageHash={preview.imageHash} siteName={preview.siteName} media={media} small={small}
                                  editing disabled={disabled} onUpdate={onUpdate(preview.url)}
                                  onDelete={onDelete(preview.url)}/>
            )}
        </div>
    );
}

interface ValueChange {
    urlsToLoad: string[];
    imagesToLoad: string[];
    value: RichTextLinkPreviewsValue;
}

function buildValue(
    urls: string[], nodeName: string | null, linkPreviewsState: LinkPreviewsState, value: RichTextLinkPreviewsValue,
    maxAutomatic: number
): ValueChange {
    if (nodeName == null || urls.length === 0) {
        return {urlsToLoad: [], imagesToLoad: [], value: {previews: [], media: [], status: value.status}};
    }

    const urlSet = new Set(urls).values();
    const loadUrls: string[] = [];
    const loadImages: string[] = [];
    const previews: LinkPreview[] = [];
    const media: VerifiedMediaFile[] = [];
    const addedUrls: string[] = [];
    let totalVisible = 0;
    for (const url of urlSet) {
        switch (value.status[url]) {
            case "deleted":
                break;

            case "edited": {
                const preview = value.previews.find(p => p.url === url);
                if (preview != null) {
                    previews.push(preview);
                    const mediaFile = value.media.find(m => m.hash === preview.imageHash);
                    if (mediaFile != null) {
                        media.push(mediaFile);
                    }
                    totalVisible++;
                }
                break;
            }

            case "loaded": {
                const lpState = linkPreviewsState[url];
                if (lpState == null || (!lpState.loading && !lpState.loaded)) {
                    loadUrls.push(url);
                }
                if (lpState != null && lpState.loaded) {
                    if (lpState.info == null) {
                        break;
                    }
                    if (!lpState.info.title && !lpState.info.description && !lpState.info.imageUrl) {
                        break;
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
                totalVisible++;
                break;
            }

            default:
                addedUrls.push(url);
                break;
        }
    }

    const istatus = immutable.wrap(value.status);
    const more = addedUrls.length <= maxAutomatic ? maxAutomatic - totalVisible : 0;
    addedUrls.forEach((url, index) =>
        istatus.set([url], index < more && !isUrlPreviewBanned(url) ? "loaded" : "deleted")
    );

    return {urlsToLoad: loadUrls, imagesToLoad: loadImages, value: {previews, media, status: istatus.value()}};
}

const BANNED_PREVIEW_DOMAINS: string[] = ["facebook.com", "instagram.com"];

function isUrlPreviewBanned(url: string) {
    const components = URI.parse(url.toLowerCase());
    if (components.host != null) {
        for (const domain of BANNED_PREVIEW_DOMAINS) {
            if (components.host === domain || components.host.endsWith("." + domain)) {
                return true;
            }
        }
    }
    return false;
}

function isImageUploading(
    linkPreviewsState: LinkPreviewsState, url: string | null | undefined, nodeName: string | null
): boolean {
    if (url == null || nodeName == null) {
        return false;
    }
    return linkPreviewsState[url]?.images[nodeName]?.uploading ?? false;
}
