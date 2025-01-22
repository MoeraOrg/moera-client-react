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
    Icon,
    msCloudDone,
    msCloudUpload,
    msDelete,
    msFileSave,
    msMediaLink,
    msPhotoLibrary,
    msSend
} from "ui/material-symbols";
import * as Browser from "ui/browser";
import { useIsTinyScreen } from "ui/hook/media-query";
import { LoadingInline } from "ui/control";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { RichTextEditorButton } from "ui/control/richtexteditor/panel/RichTextEditorButton";
import RichTextEditorEmojiButton from "ui/control/richtexteditor/panel/RichTextEditorEmojiButton";
import FormattingMenuButton from "ui/control/richtexteditor/formatting-menu/FormattingMenuButton";
import { areImagesUploaded, areValuesEmpty, CommentComposeValues } from "ui/comment/compose/comment-compose";
import { useCommentDraftSaver } from "ui/comment/compose/comment-draft-saver";
import "./CommentComposePanel.css";

function CommentComposePanel() {
    const {openLocalFiles, copyImage} = useRichTextEditorMedia();
    const {focus, supportsMedia, supportsVideo, formatEmoji, formatVideo} = useRichTextEditorCommands();

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
            onYes: () => {
                focus();
                return commentComposeCancel();
            },
            onNo: () => focus(),
            variant: "danger"
        }));
        e.preventDefault();
    };

    const {unsaved, saving, saved} = useCommentDraftSaver(null);
    const {values, submitForm} = useFormikContext<CommentComposeValues>();
    const notReady = !ready || (draft == null && areValuesEmpty(values)) || !areImagesUploaded(values);
    const tinyScreen = useIsTinyScreen();

    return (
        <div className="comment-compose-panel">
            <div className="left-pane">
                <RichTextEditorButton icon={msDelete} className={cx("delete", {"invisible": notReady})}
                                      title={t("cancel")} onClick={onCancel}/>
                {supportsMedia &&
                    <RichTextEditorButton icon={msPhotoLibrary} title={t("image")} command={() => openLocalFiles()}/>
                }
                {supportsVideo &&
                    <RichTextEditorButton icon={msMediaLink} title={t("video-internet")} command={formatVideo}/>
                }
                {supportsMedia && !tinyScreen &&
                    <RichTextEditorButton icon={msFileSave} title={t("copy-image-from-internet")} command={copyImage}/>
                }
                {!Browser.isMobile() &&
                    <RichTextEditorEmojiButton onSelect={formatEmoji}/>
                }
                <span className="formatting-menu-button">
                    <FormattingMenuButton/>
                </span>
            </div>
            <div className="right-pane">
            {ready &&
                    <span className="draft-status">
                        {!unsaved && saving && <Icon icon={msCloudUpload}/>}
                        {!unsaved && saved && <Icon icon={msCloudDone}/>}
                    </span>
                }
                {!beingPosted ?
                    <RichTextEditorButton icon={msSend} className="submit" disabled={notReady} title={t("add-comment")}
                                          onClick={() => submitForm()}/>
                :
                    <LoadingInline/>
                }
            </div>
        </div>
    );
}

export default CommentComposePanel;
