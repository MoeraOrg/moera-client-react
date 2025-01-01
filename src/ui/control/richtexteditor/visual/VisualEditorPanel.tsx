import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import {
    msAddLink,
    msAlternateEmail,
    msFormatBold,
    msFormatClear,
    msFormatIndentDecrease,
    msFormatIndentIncrease,
    msFormatItalic,
    msFormatListBulleted,
    msFormatListNumbered,
    msFormatQuote,
    msFormatQuoteOff,
    msHorizontalRule,
    msMediaLink,
    msPhotoLibrary,
    msReport,
    msStrikethroughS,
} from "ui/material-symbols";
import * as Browser from "ui/browser";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { VisualEditorButton } from "ui/control/richtexteditor/visual/VisualEditorButton";
import VisualEditorHeadingButton from "ui/control/richtexteditor/visual/VisualEditorHeadingButton";
import VisualEditorEmojiButton from "ui/control/richtexteditor/visual/VisualEditorEmojiButton";
import VisualEditorOtherButton from "ui/control/richtexteditor/visual/VisualEditorOtherButton";
import { VISUAL_EDITOR_KEYS } from "ui/control/richtexteditor/visual/visual-editor-keys";

interface Props {
    hiding?: boolean;
}

export default function VisualEditorPanel({hiding}: Props) {
    const {
        inBold, inItalic, inStrikeout, inLink, inSpoiler, inMention, inBlockquote, inList, inUnorderedList,
        inOrderedList, inImageAttached,
        formatBold, formatItalic, formatStrikeout, formatLink, formatSpoiler, formatMention, formatHorizontalRule,
        formatEmoji, formatBlockquote, formatBlockunquote, formatList, formatIndent, formatHeading, formatVideo,
        formatClear, formatImageAttached
    } = useRichTextEditorCommands();

    const {t} = useTranslation();

    return (
        <div className={cx("rich-text-editor-panel", {"hiding": hiding})}>
            <div className="group">
                <VisualEditorHeadingButton onSelect={formatHeading}/>
            </div>
            <div className="group">
                <VisualEditorButton icon={msFormatBold} title={t("bold")} hotkey={VISUAL_EDITOR_KEYS.BOLD.title}
                                    active={inBold} command={formatBold}/>
                <VisualEditorButton icon={msFormatItalic} title={t("italic")} hotkey={VISUAL_EDITOR_KEYS.ITALIC.title}
                                    active={inItalic} command={formatItalic}/>
                <VisualEditorButton icon={msStrikethroughS} title={t("strikeout")}
                                    hotkey={VISUAL_EDITOR_KEYS.STRIKEOUT.title}
                                    active={inStrikeout} command={formatStrikeout}/>
                <VisualEditorButton icon={msReport} title={t("spoiler")}
                                    active={inSpoiler} command={formatSpoiler}/>
            </div>
            <div className="group">
                <VisualEditorButton icon={msFormatListNumbered} title={t("numbered-list")}
                                    active={inOrderedList} command={() => formatList(true)}/>
                <VisualEditorButton icon={msFormatListBulleted} title={t("bulleted-list")}
                                    active={inUnorderedList} command={() => formatList(false)}/>
                {inList &&
                    <>
                        <VisualEditorButton icon={msFormatIndentIncrease} title={t("increase-indent")}
                                            command={() => formatIndent(1)}/>
                        <VisualEditorButton icon={msFormatIndentDecrease} title={t("decrease-indent")}
                                            command={() => formatIndent(-1)}/>
                    </>
                }
                <VisualEditorButton icon={msFormatQuote} title={t("quote")} hotkey={VISUAL_EDITOR_KEYS.BLOCKQUOTE.title}
                                    command={formatBlockquote}/>
                {inBlockquote &&
                    <VisualEditorButton icon={msFormatQuoteOff} title={t("unquote")}
                                        hotkey={VISUAL_EDITOR_KEYS.BLOCKUNQUOTE.title} command={formatBlockunquote}/>
                }
            </div>
            <div className="group">
                <VisualEditorButton icon={msHorizontalRule} title={t("horizontal-line")}
                                    hotkey={VISUAL_EDITOR_KEYS.HORIZONTAL_RULE.title} command={formatHorizontalRule}/>
                <VisualEditorOtherButton/>
            </div>
            <div className="group">
                {!Browser.isMobile() && <VisualEditorEmojiButton onSelect={formatEmoji}/>}
                <VisualEditorButton icon={msAlternateEmail} title={t("mention")} active={inMention}
                                    command={() => formatMention(false)}/>
            </div>
            <div className="group">
                <VisualEditorButton icon={msAddLink} title={t("link")} hotkey={VISUAL_EDITOR_KEYS.LINK.title}
                                    active={inLink} command={formatLink}/>
                <VisualEditorButton icon={msPhotoLibrary} title={t("image")} active={inImageAttached}
                                    command={formatImageAttached}/>
                <VisualEditorButton icon={msMediaLink} title={t("video-internet")} command={formatVideo}/>
            </div>
            <div className="group">
                <VisualEditorButton icon={msFormatClear} title={t("clear-formatting")}
                                    hotkey={VISUAL_EDITOR_KEYS.CLEAR.title} command={formatClear}/>
            </div>
        </div>
    );
}
