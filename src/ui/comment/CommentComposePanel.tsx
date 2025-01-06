import React from 'react';
import { useTranslation } from 'react-i18next';

import { msAddLink, msAlternateEmail, msFileSave, msMediaLink, msPhotoLibrary } from "ui/material-symbols";
import * as Browser from "ui/browser";
import { RICH_TEXT_EDITOR_KEYS } from "ui/control/richtexteditor/rich-text-editor-keys";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { RichTextEditorButton } from "ui/control/richtexteditor/panel/RichTextEditorButton";
import RichTextEditorEmojiButton from "ui/control/richtexteditor/panel/RichTextEditorEmojiButton";
import "./CommentComposePanel.css";

function CommentComposePanel() {
    const {openLocalFiles, copyImage} = useRichTextEditorMedia();
    const {
        supportsMedia, supportsVideo, inLink, inMention, formatLink, formatMention, formatEmoji, formatVideo
    } = useRichTextEditorCommands();

    const {t} = useTranslation();

    return (
        <div className="comment-compose-panel">
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
    );
}

export default CommentComposePanel;
