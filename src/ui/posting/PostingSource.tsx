import React from 'react';
import { useSelector } from 'react-redux';

import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { Icon, msRepeat } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import { DelayedPopover } from "ui/control";
import PostingSources from "ui/posting/PostingSources";
import { ut } from "util/url";
import "./PostingSource.css";

interface Props {
    posting: PostingInfo;
}

export default function PostingSource({posting}: Props) {
    const openInNewWindow = useSelector((state: ClientState) => getSetting(state, "link.new-window") as boolean);

    const externalSourceUri = posting.externalSourceUri != null && posting.externalSourceUri.length > 0
        ? posting.externalSourceUri[0]
        : null;

    if (posting.receiverName == null && externalSourceUri == null) {
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
                return null;
            }
        }>
            <PostingSources posting={posting}/>
        </DelayedPopover>
    );
}
