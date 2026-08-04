import React from 'react';
import { useSelector } from 'react-redux';

import { PublicMediaFileInfo } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { openLightbox } from "state/lightbox/actions";
import { useDispatcher } from "ui/hook";
import { Icon, msPlayArrowFilled } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import { resolveMediaUrl } from "util/media-url";
import { REL_SEARCH, RelNodeName } from "util/rel-node-name";
import { urlWithParameters, ut } from "util/url";
import { isVideoType } from "util/mime-type";
import "./SearchEntryImagePreview.css";

interface Props {
    nodeName: RelNodeName | string;
    postingId: string | null;
    commentId?: string | null;
    mediaId: string;
    mediaFile: PublicMediaFileInfo;
    mediaMimeType: string;
}

export default function SearchEntryImagePreview({
    nodeName, postingId, commentId, mediaId, mediaFile, mediaMimeType
}: Props) {
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, REL_SEARCH));
    const dispatch = useDispatcher();

    const onNear = () => {
        if (postingId != null) {
            dispatch(openLightbox(nodeName, postingId, commentId ?? null, mediaId, false));
        }
    }

    const href = urlWithParameters(ut`/post/${postingId}`, {commentId, media: mediaId});

    const imagePath = mediaFile.directPath ?? mediaFile.path;
    const height = mediaFile.height ?? 300;
    const style: React.CSSProperties = {
        "--width": "300px",
        "--height": `${height}px`,
        "--aspect-ratio": `${300 / height}`,
        width: "300px",
        height: `${height}px`,
    } as any;

    return (
        <Jump nodeName={nodeName} href={href} onNear={onNear} className="preview">
            <img src={resolveMediaUrl(rootPage, imagePath)} style={style} alt=""/>
            {isVideoType(mediaMimeType) &&
                <div className="play-icon"><Icon icon={msPlayArrowFilled} size={48}/></div>
            }
        </Jump>
    );
}
