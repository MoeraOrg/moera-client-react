import React, { useState } from 'react';
import cx from 'classnames';

import CommentRepliedTo from "ui/comment/CommentRepliedTo";
import EntryHtml from "ui/posting/EntryHtml";
import { hasWindowSelection } from "util/misc";

function CommentContent({comment, previousId}) {
    const [preview, setPreview] = useState(true);

    const onClick = () => {
        if (!hasWindowSelection()) {
            setPreview(preview => !preview);
        }
    }

    const renderText = () => {
        if (preview) {
            if (comment.bodyPreview.text) {
                return (
                    <>
                        <EntryHtml html={comment.bodyPreview.text} onClick={onClick}/>
                        <p>
                            <button className="btn btn-link read-more" onClick={onClick}>Read more...</button>
                        </p>
                    </>
                );
            } else {
                return <EntryHtml html={comment.body.previewText}/>;
            }
        } else {
            return <EntryHtml html={comment.body.text} onClick={onClick}/>;
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
