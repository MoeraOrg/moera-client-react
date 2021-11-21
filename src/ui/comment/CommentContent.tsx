import React, { useState } from 'react';
import cx from 'classnames';

import CommentRepliedTo from "ui/comment/CommentRepliedTo";
import EntryHtml from "ui/posting/EntryHtml";
import { hasWindowSelection } from "util/misc";
import { ExtCommentInfo } from "state/detailedposting/state";

interface Props {
    comment: ExtCommentInfo;
    previousId: string | null;
    receiverName: string | null;
}

function CommentContent({comment, previousId, receiverName}: Props) {
    const [preview, setPreview] = useState(true);

    const onClick = () => {
        if (!hasWindowSelection()) {
            setPreview(preview => !preview);
        }
    }

    const renderText = () => {
        if (preview) {
            if (comment.bodyPreview?.text) {
                return (
                    <>
                        <EntryHtml postingId={comment.postingId} html={comment.bodyPreview.text} nodeName={receiverName}
                                   media={comment.media} onClick={onClick}/>
                        <p>
                            <button className="btn btn-link read-more" onClick={onClick}>Read more...</button>
                        </p>
                    </>
                );
            } else {
                return <EntryHtml postingId={comment.postingId} html={comment.body.previewText}nodeName={receiverName}
                                  media={comment.media}/>;
            }
        } else {
            return <EntryHtml postingId={comment.postingId} html={comment.body.text} nodeName={receiverName}
                              media={comment.media} onClick={onClick}/>;
        }
    }

    return (
        <div className={cx("content", {"preview": preview})}>
            <CommentRepliedTo comment={comment} previousId={previousId}/>
            {renderText()}
        </div>
    );
}

export default CommentContent;
