import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import {
    faAt,
    faBold,
    faExclamationCircle,
    faItalic,
    faLink,
    faMinus,
    faQuoteLeft, faQuoteRight,
    faStrikethrough
} from '@fortawesome/free-solid-svg-icons';

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
        inBold, inItalic, inStrikeout, inLink, inSpoiler, inMention, inBlockquote,
        formatBold, formatItalic, formatStrikeout, formatLink, formatSpoiler, formatMention, formatHorizontalRule,
        formatEmoji, formatBlockquote, formatBlockunquote
    } = useVisualEditorCommands();

    const {t} = useTranslation();

    return (
        <div className={cx("rich-text-editor-panel", {"hiding": hiding})}>
            <div className="group">
                <VisualEditorButton icon={faBold} title={t("bold")} letter={VISUAL_EDITOR_KEYS.BOLD}
                                    active={inBold} command={formatBold}/>
                <VisualEditorButton icon={faItalic} title={t("italic")} letter={VISUAL_EDITOR_KEYS.ITALIC}
                                    active={inItalic} command={formatItalic}/>
                <VisualEditorButton icon={faStrikethrough} title={t("strikeout")} letter={VISUAL_EDITOR_KEYS.STRIKEOUT}
                                    active={inStrikeout} command={formatStrikeout}/>
                <VisualEditorButton icon={faExclamationCircle} title={t("spoiler")}
                                    active={inSpoiler} command={formatSpoiler}/>
            </div>
            <div className="group">
                <VisualEditorButton icon={faQuoteLeft} title={t("quote")} letter={VISUAL_EDITOR_KEYS.BLOCKQUOTE}
                                    command={formatBlockquote}/>
                {inBlockquote &&
                    <VisualEditorButton icon={faQuoteRight} title={t("unquote")} command={formatBlockunquote}/>
                }
                <VisualEditorButton icon={faMinus} title={t("horizontal-line")} command={formatHorizontalRule}/>
            </div>
            <div className="group">
                {!Browser.isMobile() && <VisualEditorEmojiButton onSelect={formatEmoji}/>}
                <VisualEditorButton icon={faAt} title={t("mention")} active={inMention} command={formatMention}/>
            </div>
            <div className="group">
                <VisualEditorButton icon={faLink} title={t("link")} letter={VISUAL_EDITOR_KEYS.LINK}
                                    active={inLink} command={formatLink}/>
            </div>
        </div>
    );
}
