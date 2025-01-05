import React from 'react';
import { useSelector } from 'react-redux';
import deepEqual from 'react-fast-compare';

import { MediaAttachment, PostingInfo } from "api";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { getPosting } from "state/postings/selectors";
import EntryGallery from "ui/entry/EntryGallery";
import EntryHtml from "ui/entry/EntryHtml";
import PostingReactions from "ui/posting/PostingReactions";
import EntryGalleryButtons from "ui/entry/EntryGalleryButtons";
import { RelNodeName } from "util/rel-node-name";
import { notNull } from "util/misc";
import "./EntryGalleryExpanded.css";

interface Props {
    nodeName: RelNodeName | string;
    postingId: string;
    media: MediaAttachment[] | null;
    onCollapse: () => void;
}

export default function EntryGalleryExpanded({nodeName, postingId, media, onCollapse}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const mediaPostings = useSelector((state: ClientState) => getMediaPostings(state, nodeName, media), deepEqual);

    return (
        <div id="posting-gallery" className="gallery-expanded">
            {media?.map(media => {
                const mediaFile = media.media;
                if (mediaFile == null) {
                    return null;
                }
                const posting = mediaPostings.get(mediaFile.id);
                return (
                    <div key={mediaFile.id} className="mt-4 mb-4">
                        <EntryGallery postingId={postingId} nodeName={nodeName} media={[media]}
                                      onCollapse={onCollapse}/>
                        {posting &&
                            <>
                                <EntryHtml className="content" postingId={posting.id} html={posting.body.text}
                                           nodeName={nodeName}/>
                                <div className="reactions-line">
                                    <PostingReactions nodeName={nodeName} postingId={posting.id}
                                                      reactions={posting.reactions}/>
                                </div>
                                {connectedToHome && <EntryGalleryButtons posting={posting} mediaId={mediaFile.id}/>}
                            </>
                        }
                    </div>
                );
            })}
        </div>
    );
}

function getMediaPostings(
    state: ClientState, nodeName: RelNodeName | string, media: MediaAttachment[] | null
): Map<string, PostingInfo> {
    if (media == null || media.length === 0) {
        return new Map();
    }
    return new Map(media
        .filter(ma => !ma.embedded)
        .map(ma => ma.media)
        .filter(notNull)
        .map(m => [m.id, getPosting(state, m.postingId ?? null, nodeName)])
        .filter((r): r is [string, PostingInfo] => r[1] != null)
    );
}
