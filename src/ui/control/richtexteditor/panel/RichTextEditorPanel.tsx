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
import { RICH_TEXT_EDITOR_KEYS } from "ui/control/richtexteditor/rich-text-editor-keys";
import { RichTextEditorButton } from "ui/control/richtexteditor/panel/RichTextEditorButton";
import RichTextEditorHeadingButton from "ui/control/richtexteditor/panel/RichTextEditorHeadingButton";
import RichTextEditorEmojiButton from "ui/control/richtexteditor/panel/RichTextEditorEmojiButton";
import RichTextEditorOtherButton from "ui/control/richtexteditor/panel/RichTextEditorOtherButton";

interface Props {
    hiding?: boolean;
}

export default function RichTextEditorPanel({hiding}: Props) {
    const {
        supportsComplexBlocks, supportsEmbeddedMedia, supportsMedia, supportsVideo, supportsClear,
        inBold, inItalic, inStrikeout, inLink, inSpoiler, inMention, inBlockquote, inList, inUnorderedList,
        inOrderedList, inImageAttached,
        formatBold, formatItalic, formatStrikeout, formatLink, formatSpoiler, formatMention, formatHorizontalRule,
        formatEmoji, formatBlockquote, formatBlockunquote, formatList, formatIndent, formatHeading, formatVideo,
        formatClear, formatImage
    } = useRichTextEditorCommands();

    const {t} = useTranslation();

    return (
        <div className={cx("rich-text-editor-panel", {"hiding": hiding})}>
            {supportsComplexBlocks &&
                <div className="group">
                    <RichTextEditorHeadingButton onSelect={formatHeading}/>
                </div>
            }
            <div className="group">
                <RichTextEditorButton icon={msFormatBold} title={t("bold")} hotkey={RICH_TEXT_EDITOR_KEYS.BOLD.title}
                                      active={inBold} command={formatBold}/>
                <RichTextEditorButton icon={msFormatItalic} title={t("italic")}
                                      hotkey={RICH_TEXT_EDITOR_KEYS.ITALIC.title} active={inItalic} command={formatItalic}/>
                <RichTextEditorButton icon={msStrikethroughS} title={t("strikeout")}
                                      hotkey={RICH_TEXT_EDITOR_KEYS.STRIKEOUT.title}
                                      active={inStrikeout} command={formatStrikeout}/>
                <RichTextEditorButton icon={msReport} title={t("spoiler")}
                                      active={inSpoiler} command={formatSpoiler}/>
            </div>
            {supportsComplexBlocks &&
                <div className="group">
                    <RichTextEditorButton icon={msFormatListNumbered} title={t("numbered-list")}
                                          active={inOrderedList} command={() => formatList(true)}/>
                    <RichTextEditorButton icon={msFormatListBulleted} title={t("bulleted-list")}
                                          active={inUnorderedList} command={() => formatList(false)}/>
                    {inList &&
                        <>
                            <RichTextEditorButton icon={msFormatIndentIncrease} title={t("increase-indent")}
                                                  command={() => formatIndent(1)}/>
                            <RichTextEditorButton icon={msFormatIndentDecrease} title={t("decrease-indent")}
                                                  command={() => formatIndent(-1)}/>
                        </>
                    }
                    <RichTextEditorButton icon={msFormatQuote} title={t("quote")}
                                          hotkey={RICH_TEXT_EDITOR_KEYS.BLOCKQUOTE.title} command={formatBlockquote}/>
                    {inBlockquote &&
                        <RichTextEditorButton icon={msFormatQuoteOff} title={t("unquote")}
                                              hotkey={RICH_TEXT_EDITOR_KEYS.BLOCKUNQUOTE.title}
                                              command={formatBlockunquote}/>
                    }
                </div>
            }
            <div className="group">
                {supportsComplexBlocks &&
                    <RichTextEditorButton icon={msHorizontalRule} title={t("horizontal-line")}
                                          hotkey={RICH_TEXT_EDITOR_KEYS.HORIZONTAL_RULE.title}
                                          command={formatHorizontalRule}/>
                }
                <RichTextEditorOtherButton/>
            </div>
            <div className="group">
                {!Browser.isMobile() &&
                    <RichTextEditorEmojiButton onSelect={formatEmoji}/>
                }
                <RichTextEditorButton icon={msAlternateEmail} title={t("mention")} active={inMention}
                                      command={() => formatMention(false)}/>
            </div>
            <div className="group">
                <RichTextEditorButton icon={msAddLink} title={t("link")} hotkey={RICH_TEXT_EDITOR_KEYS.LINK.title}
                                      active={inLink} command={formatLink}/>
                {supportsEmbeddedMedia && supportsMedia &&
                    <RichTextEditorButton icon={msPhotoLibrary} title={t("image")} active={inImageAttached}
                                          command={() => formatImage(false)}/>
                }
                {supportsVideo &&
                    <RichTextEditorButton icon={msMediaLink} title={t("video-internet")} command={formatVideo}/>
                }
            </div>
            {supportsClear &&
                <div className="group">
                    <RichTextEditorButton icon={msFormatClear} title={t("clear-formatting")}
                                          hotkey={RICH_TEXT_EDITOR_KEYS.CLEAR.title} command={formatClear}/>
                </div>
            }
        </div>
    );
}
