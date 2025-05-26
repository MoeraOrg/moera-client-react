import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PublicMediaFileInfo } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { openLightBox } from "state/lightbox/actions";
import Jump from "ui/navigation/Jump";
import { REL_SEARCH, RelNodeName } from "util/rel-node-name";
import { urlWithParameters, ut } from "util/url";
import "./SearchEntryImagePreview.css";

interface Props {
    nodeName: RelNodeName | string;
    postingId: string | null;
    commentId?: string | null;
    mediaId: string;
    mediaFile: PublicMediaFileInfo;
}

export default function SearchEntryImagePreview({nodeName, postingId, commentId, mediaId, mediaFile}: Props) {
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, REL_SEARCH));
    const dispatch = useDispatch();

    const onNear = () => {
        if (postingId != null) {
            dispatch(openLightBox(nodeName, postingId, commentId ?? null, mediaId));
        }
    }

    const href = urlWithParameters(ut`/post/${postingId}`, {commentId, media: mediaId});

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
            <img src={`${rootPage}/media/${mediaFile.path}`} style={style} alt=""/>
        </Jump>
    );
}
