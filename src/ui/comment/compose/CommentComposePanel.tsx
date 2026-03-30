import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import cx from 'classnames';

import { ClientState } from "state/state";
import { confirmBox } from "state/confirmbox/actions";
import { commentComposeCancel } from "state/detailedposting/actions";
import { isCommentComposerReady } from "state/detailedposting/selectors";
import { useDispatcher } from "ui/hook";
import {
    Icon,
    msAttachFile,
    msCloudDone,
    msCloudUpload,
    msDelete,
    msDraft,
    msFileSave,
    msImage,
    msMediaLink
} from "ui/material-symbols";
import * as Browser from "ui/browser";
import { DropdownMenu, OnlyDesktop } from "ui/control";
import { AttachmentType, useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { RichTextEditorButton } from "ui/control/richtexteditor/panel/RichTextEditorButton";
import RichTextEditorEmojiButton from "ui/control/richtexteditor/panel/RichTextEditorEmojiButton";
import FormattingMenuButton from "ui/control/richtexteditor/formatting-menu/FormattingMenuButton";
import { areImagesUploaded, areValuesEmpty, CommentComposeValues } from "ui/comment/compose/comment-compose";
import { useCommentDraftSaver } from "ui/comment/compose/comment-draft-saver";
import CommentSubmitButton from "ui/comment/compose/CommentSubmitButton";
import { REL_CURRENT } from "util/rel-node-name";
import "./CommentComposePanel.css";

function CommentComposePanel() {
    const {openLocalFiles, copyImage, attachmentType, setAttachmentType} = useRichTextEditorMedia();
    const {focus, supportsMedia, supportsVideo, formatEmoji, formatVideo} = useRichTextEditorCommands();

    const ready = useSelector(isCommentComposerReady);
    const draft = useSelector((state: ClientState) => state.detailedPosting.compose.draft);
    const beingPosted = useSelector((state: ClientState) => state.detailedPosting.compose.beingPosted);
    const dispatch = useDispatcher();

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

    const onAttach = (type: AttachmentType) => () => {
        if (attachmentType === type) {
            openLocalFiles();
        } else {
            setAttachmentType(type);
            setTimeout(() => openLocalFiles(), 200);
        }
    };

    const {unsaved, saving, saved} = useCommentDraftSaver(null);
    const {values, submitForm} = useFormikContext<CommentComposeValues>();
    const notReady = !ready || (draft == null && areValuesEmpty(values)) || !areImagesUploaded(values);

    return (
        <div className="comment-compose-panel">
            <div className="left-pane">
                <RichTextEditorButton icon={msDelete} className={cx("delete", {"invisible": notReady})}
                                      title={t("cancel")} onClick={onCancel}/>
                {supportsMedia &&
                    <DropdownMenu items={[
                        {
                            icon: msImage,
                            title: t("images"),
                            nodeName: REL_CURRENT,
                            href: "/",
                            onClick: onAttach("image"),
                            show: true
                        },
                        {
                            icon: msDraft,
                            title: t("files"),
                            nodeName: REL_CURRENT,
                            href: "/",
                            onClick: onAttach("file"),
                            show: true
                        },
                    ]} className="rich-text-editor-button">
                        <Icon icon={msAttachFile} title={t("attach")}/>
                    </DropdownMenu>
                }
                {supportsVideo &&
                    <RichTextEditorButton icon={msMediaLink} title={t("video-internet")} command={formatVideo}/>
                }
                {supportsMedia &&
                    <OnlyDesktop>
                        <RichTextEditorButton icon={msFileSave} title={t("copy-image-from-internet")}
                                              command={copyImage}/>
                    </OnlyDesktop>
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
                <CommentSubmitButton disabled={notReady} beingPosted={beingPosted} onClick={() => submitForm()}/>
            </div>
        </div>
    );
}

export default CommentComposePanel;
