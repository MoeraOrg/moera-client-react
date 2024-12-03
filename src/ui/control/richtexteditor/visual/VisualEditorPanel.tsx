import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import {
    msAddLink,
    msAlternateEmail,
    msFormatBold,
    msFormatIndentDecrease,
    msFormatIndentIncrease,
    msFormatItalic,
    msFormatListBulleted,
    msFormatListNumbered,
    msFormatQuote,
    msFormatQuoteOff,
    msFormatStrikethrough,
    msHorizontalRule,
    msReport
} from "ui/material-symbols";
import * as Browser from "ui/browser";
import { VisualEditorButton } from "ui/control/richtexteditor/visual/VisualEditorButton";
import VisualEditorEmojiButton from "ui/control/richtexteditor/visual/VisualEditorEmojiButton";
import { useVisualEditorCommands } from "ui/control/richtexteditor/visual/visual-editor-commands-context";
import { VISUAL_EDITOR_KEYS } from "ui/control/richtexteditor/visual/visual-editor-keys";

interface Props {
    hiding?: boolean;
}

export default function VisualEditorPanel({hiding}: Props) {
    const {
        enableBlockquote,
        inBold, inItalic, inStrikeout, inLink, inSpoiler, inMention, inBlockquote, inList, inUnorderedList,
        inOrderedList,
        formatBold, formatItalic, formatStrikeout, formatLink, formatSpoiler, formatMention, formatHorizontalRule,
        formatEmoji, formatBlockquote, formatBlockunquote, formatList, formatIndent
    } = useVisualEditorCommands();

    const {t} = useTranslation();

    return (
        <div className={cx("rich-text-editor-panel", {"hiding": hiding})}>
            <div className="group">
                <VisualEditorButton icon={msFormatBold} title={t("bold")} letter={VISUAL_EDITOR_KEYS.BOLD}
                                    active={inBold} command={formatBold}/>
                <VisualEditorButton icon={msFormatItalic} title={t("italic")} letter={VISUAL_EDITOR_KEYS.ITALIC}
                                    active={inItalic} command={formatItalic}/>
                <VisualEditorButton icon={msFormatStrikethrough} title={t("strikeout")}
                                    letter={VISUAL_EDITOR_KEYS.STRIKEOUT}
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
            </div>
            <div className="group">
                {enableBlockquote &&
                    <VisualEditorButton icon={msFormatQuote} title={t("quote")} letter={VISUAL_EDITOR_KEYS.BLOCKQUOTE}
                                        command={formatBlockquote}/>
                }
                {inBlockquote &&
                    <VisualEditorButton icon={msFormatQuoteOff} title={t("unquote")} command={formatBlockunquote}/>
                }
                <VisualEditorButton icon={msHorizontalRule} title={t("horizontal-line")}
                                    command={formatHorizontalRule}/>
            </div>
            <div className="group">
                {!Browser.isMobile() && <VisualEditorEmojiButton onSelect={formatEmoji}/>}
                <VisualEditorButton icon={msAlternateEmail} title={t("mention")} active={inMention}
                                    command={() => formatMention(false)}/>
            </div>
            <div className="group">
                <VisualEditorButton icon={msAddLink} title={t("link")} letter={VISUAL_EDITOR_KEYS.LINK}
                                    active={inLink} command={formatLink}/>
            </div>
        </div>
    );
}
