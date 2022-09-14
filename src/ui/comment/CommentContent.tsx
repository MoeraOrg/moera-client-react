import React, { useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ExtCommentInfo } from "state/detailedposting/state";
import CommentRepliedTo from "ui/comment/CommentRepliedTo";
import EntryHtml from "ui/entry/EntryHtml";
import { hasWindowSelection } from "util/misc";

interface Props {
    comment: ExtCommentInfo;
    previousId: string | null;
    receiverName: string | null;
}

function CommentContent({comment, previousId, receiverName}: Props) {
    const [preview, setPreview] = useState(true);

    const {t} = useTranslation();

    const onClick = (e: React.MouseEvent) => {
        if (!hasWindowSelection()
            && !(e.target instanceof HTMLImageElement)
            && !(e.target instanceof HTMLAnchorElement)) {

            setPreview(preview => !preview);
        }
    }

    const renderText = () => {
        if (preview) {
            if (comment.bodyPreview?.text) {
                return (
                    <>
                        <EntryHtml postingId={comment.postingId} commentId={comment.id} html={comment.bodyPreview.text}
                                   nodeName={receiverName} media={comment.media} onClick={onClick}/>
                        <p>
                            <button className="btn btn-link read-more" onClick={onClick}>{t("read-more")}</button>
                        </p>
                    </>
                );
            } else {
                return <EntryHtml postingId={comment.postingId} commentId={comment.id} html={comment.body.previewText}
                                  nodeName={receiverName} media={comment.media}/>;
            }
        } else {
            return <EntryHtml postingId={comment.postingId} commentId={comment.id} html={comment.body.text}
                              nodeName={receiverName} media={comment.media} onClick={onClick}/>;
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
