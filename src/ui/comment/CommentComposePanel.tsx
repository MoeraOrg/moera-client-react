import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import cx from 'classnames';

import { ClientState } from "state/state";
import { confirmBox } from "state/confirmbox/actions";
import { commentComposeCancel } from "state/detailedposting/actions";
import { isCommentComposerReady } from "state/detailedposting/selectors";
import {
    msAddLink,
    msAlternateEmail,
    msDelete,
    msFileSave,
    msMediaLink,
    msPhotoLibrary,
    msSend
} from "ui/material-symbols";
import * as Browser from "ui/browser";
import { LoadingInline } from "ui/control";
import { RICH_TEXT_EDITOR_KEYS } from "ui/control/richtexteditor/rich-text-editor-keys";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { RichTextEditorButton } from "ui/control/richtexteditor/panel/RichTextEditorButton";
import RichTextEditorEmojiButton from "ui/control/richtexteditor/panel/RichTextEditorEmojiButton";
import { areImagesUploaded, areValuesEmpty, CommentComposeValues } from "ui/comment/comment-compose";
import "./CommentComposePanel.css";

function CommentComposePanel() {
    const {openLocalFiles, copyImage} = useRichTextEditorMedia();
    const {
        supportsMedia, supportsVideo, inLink, inMention, formatLink, formatMention, formatEmoji, formatVideo
    } = useRichTextEditorCommands();

    const ready = useSelector(isCommentComposerReady);
    const draft = useSelector((state: ClientState) => state.detailedPosting.compose.draft);
    const beingPosted = useSelector((state: ClientState) => state.detailedPosting.compose.beingPosted);
    const dispatch = useDispatch();

    const {t} = useTranslation();

    const onCancel = (e: React.MouseEvent) => {
        dispatch(confirmBox({
            message: t("forget-unfinished-comment"),
            yes: t("forget"),
            no: t("cancel"),
            onYes: commentComposeCancel(),
            variant: "danger"
        }));
        e.preventDefault();
    };

    const {values, submitForm} = useFormikContext<CommentComposeValues>();
    const notReady = !ready || (draft == null && areValuesEmpty(values)) || !areImagesUploaded(values);

    return (
        <div className="comment-compose-panel">
            <div className="left-pane">
                <RichTextEditorButton icon={msDelete} iconSize={20} className={cx("delete", {"invisible": notReady})}
                                      title={t("cancel")} onClick={onCancel}/>
                {supportsMedia &&
                    <RichTextEditorButton icon={msPhotoLibrary} iconSize={20} title={t("image")}
                                          command={() => openLocalFiles()}/>
                }
                {supportsVideo &&
                    <RichTextEditorButton icon={msMediaLink} title={t("video-internet")} command={formatVideo}/>
                }
                {supportsMedia &&
                    <RichTextEditorButton icon={msFileSave} iconSize={20} title={t("copy-image-from-internet")}
                                          command={copyImage}/>
                }
                <RichTextEditorButton icon={msAddLink} iconSize={20} title={t("link")}
                                      hotkey={RICH_TEXT_EDITOR_KEYS.LINK.title} active={inLink} command={formatLink}/>
                <RichTextEditorButton icon={msAlternateEmail} iconSize={20} title={t("mention")} active={inMention}
                                      command={() => formatMention(false)}/>
                {!Browser.isMobile() &&
                    <RichTextEditorEmojiButton iconSize={20} onSelect={formatEmoji}/>
                }
            </div>
            <div className="right-pane">
                {!beingPosted ?
                    <RichTextEditorButton icon={msSend} iconSize={20} className="submit" disabled={notReady}
                                          title={t("add-comment")} onClick={() => submitForm()}/>
                :
                    <LoadingInline/>
                }
            </div>
        </div>
    );
}

export default CommentComposePanel;
