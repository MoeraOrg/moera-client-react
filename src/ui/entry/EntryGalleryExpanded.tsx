import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { MediaAttachment, PostingInfo, PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { getPosting } from "state/postings/selectors";
import EntryGallery from "ui/entry/EntryGallery";
import EntryHtml from "ui/entry/EntryHtml";
import PostingReactions from "ui/posting/PostingReactions";
import EntryGalleryButtons from "ui/entry/EntryGalleryButtons";
import "./EntryGalleryExpanded.css";

interface OwnProps {
    nodeName: string | null;
    postingId: string;
    media: MediaAttachment[] | null;
    onCollapse: () => void;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const EntryGalleryExpanded = ({nodeName, postingId, media, onCollapse, connectedToHome, mediaPostings}: Props) => (
    <div id="posting-gallery" className="gallery-expanded">
        {media?.map(media => {
            const mediaFile = media.media;
            if (mediaFile == null) {
                return null;
            }
            const posting = mediaPostings.get(mediaFile.id);
            return (
                <div key={mediaFile.id} className="mt-4 mb-4">
                    <EntryGallery postingId={postingId} nodeName={nodeName} media={[media]} onCollapse={onCollapse}/>
                    {posting &&
                        <>
                            <EntryHtml className="content" postingId={posting.id} html={posting.body.text} nodeName=""/>
                            <div className="reactions-line">
                                <PostingReactions posting={posting}/>
                            </div>
                            {connectedToHome && <EntryGalleryButtons posting={posting} mediaId={mediaFile.id}/>}
                        </>
                    }
                </div>
            );
        })}
    </div>
);

function getMediaPostings(state: ClientState, media: MediaAttachment[] | null): Map<string, PostingInfo> {
    if (media == null || media.length === 0) {
        return new Map();
    }
    return new Map(media
        .map(ma => ma.media)
        .filter((m): m is PrivateMediaFileInfo => m != null)
        .map(m => [m.id, getPosting(state, m.postingId ?? null)])
        .filter((r): r is [string, PostingInfo] => r[1] != null)
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        connectedToHome: isConnectedToHome(state),
        mediaPostings: getMediaPostings(state, ownProps.media),
    })
);

export default connector(EntryGalleryExpanded);
