import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { Icon, msRepeat } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import { DelayedPopover } from "ui/control";
import PostingSources from "ui/posting/PostingSources";
import { RelNodeName } from "util/rel-node-name";
import { urlWithParameters, ut } from "util/url";
import "./PostingSource.css";

interface Props {
    nodeName: RelNodeName | string;
    posting: PostingInfo;
}

export default function PostingSource({nodeName, posting}: Props) {
    const openInNewWindow = useSelector((state: ClientState) => getSetting(state, "link.new-window") as boolean);

    const externalSourceUri = posting.externalSourceUri != null && posting.externalSourceUri.length > 0
        ? posting.externalSourceUri[0]
        : null;

    const reposts = useMemo(
        () => posting.feedReferences?.filter(r => r.feedName === "timeline").toSorted((a, b) => a.moment - b.moment)
            ?? [],
        [posting]
    );

    if (posting.receiverName == null && externalSourceUri == null && reposts.length <= 1) {
        return null;
    }

    return (
        <DelayedPopover placement="bottom-start" arrow element={
            ref => {
                if (posting.receiverName != null) {
                    return (
                        <Jump ref={ref} className="posting-source" nodeName={posting.receiverName}
                              href={ut`/post/${posting.receiverPostingId}`}>
                            <Icon icon={msRepeat} size="1em"/>
                        </Jump>
                    );
                }
                if (externalSourceUri != null) {
                    return (
                        <a ref={ref} className="posting-source" href={externalSourceUri}
                           target={openInNewWindow ? "_blank" : undefined} rel="noreferrer">
                            <Icon icon={msRepeat} size="1em"/>
                        </a>
                    );
                }
                if (reposts.length > 1) {
                    return (
                        <Jump ref={ref} className="posting-source" nodeName={nodeName}
                              href={urlWithParameters("/timeline", {before: reposts[0].moment})}>
                            <Icon icon={msRepeat} size="1em"/>
                        </Jump>
                    );
                }
                return null;
            }
        }>
            <PostingSources nodeName={nodeName} posting={posting}/>
        </DelayedPopover>
    );
}
