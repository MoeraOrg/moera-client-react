import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import Jump from "ui/navigation/Jump";
import { NodeName } from "ui/control";
import "./PostingSources.css";

const PostingSources = ({posting}) => (
    <div className="posting-sources">
        <div className="title">Where it comes from?</div>
        {sourcesList(posting).map((line, index) =>
            <div className="source" key={index}>
                <span className={cx("icon", {"original": line.original})}>
                    <FontAwesomeIcon icon={line.original ? "star" : "share-square"}/>
                </span>
                <Jump nodeName={line.nodeName} href={`/post/${line.postingId}`}>
                    <NodeName name={line.nodeName} linked={false}/> in {line.feedTitle}
                </Jump>
            </div>
        )}
    </div>
);

function sourcesList(posting) {
    const list = posting.sources
        .filter(sr => sr.nodeName !== posting.receiverName || sr.postingId !== posting.receiverPostingId)
        .sort((sr1, sr2) => sr1.createdAt - sr2.createdAt)
        .map(sr => ({
            nodeName: sr.nodeName,
            feedTitle: feedTitle(sr.feedName),
            postingId: sr.postingId,
            original: false
        }));

    const receiverFeedName = posting.sources
        .find(sr => sr.nodeName === posting.receiverName && sr.postingId === posting.receiverPostingId)
        .feedName;
    list.unshift({
        nodeName: posting.receiverName,
        feedTitle: feedTitle(receiverFeedName),
        postingId: posting.receiverPostingId,
        original: true
    });

    return list;
}

function feedTitle(feedName) {
    switch (feedName) {
        case "timeline":
            return "Timeline";
        case "news":
            return "News";
        case null:
            return "Timeline";
        default:
            return feedName;
    }
}

export default PostingSources;
