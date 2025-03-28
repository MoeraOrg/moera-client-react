import React from 'react';
import * as ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

import * as Browser from "ui/browser";
import { useButtonPopper } from "ui/hook";
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
    msFormatSize,
    msHorizontalRule,
    msReport,
    msStrikethroughS
} from "ui/material-symbols";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { RichTextEditorButton } from "ui/control/richtexteditor/panel/RichTextEditorButton";
import { RICH_TEXT_EDITOR_KEYS } from "ui/control/richtexteditor/rich-text-editor-keys";
import { DropdownMenuContext } from "ui/control/dropdownmenu/dropdown-menu-types";
import { FormattingMenuItem } from "ui/control/richtexteditor/formatting-menu/FormattingMenuItem";
import FormattingHeadingButton from "ui/control/richtexteditor/formatting-menu/FormattingHeadingButton";
import FormattingOtherButton from "ui/control/richtexteditor/formatting-menu/FormattingOtherButton";
import "./FormattingMenuButton.css";

export default function FormattingMenuButton() {
    const {
        supportsComplexBlocks, supportsClear,
        inBold, inItalic, inStrikeout, inSpoiler, inOrderedList, inUnorderedList, inList, inBlockquote, inMention,
        inLink,
        focus, resetSelection, formatBold, formatItalic, formatStrikeout, formatSpoiler, formatList, formatIndent,
        formatBlockquote, formatBlockunquote, formatHorizontalRule, formatMention, formatLink, formatClear,
        formatHeading
    } = useRichTextEditorCommands();

    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes, zIndex, overlayId
    } = useButtonPopper(Browser.isMobile() ? "bottom" : "top", {closeOnSelect: false});
    const {t} = useTranslation();

    const onClick = (event: React.MouseEvent) => {
        focus();
        resetSelection();
        onToggle(event);
    }

    return (
        <span className={visible ? "dropup" : undefined}>
            <RichTextEditorButton className="selector dropdown-toggle" icon={msFormatSize} iconSize={20}
                                  title={t("text-formatting")} onClick={onClick} ref={setButtonRef}/>
            {visible && ReactDOM.createPortal(
                <DropdownMenuContext.Provider value={{hide, overlayId}}>
                    <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                         className={"fade formatting-menu dropdown-menu shadow-sm show"}>
                        <FormattingMenuItem icon={msFormatBold} title={t("bold")}
                                            hotkey={RICH_TEXT_EDITOR_KEYS.BOLD.title} active={inBold}
                                            command={formatBold}/>
                        <FormattingMenuItem icon={msFormatItalic} title={t("italic")}
                                            hotkey={RICH_TEXT_EDITOR_KEYS.ITALIC.title} active={inItalic}
                                            command={formatItalic}/>
                        <FormattingMenuItem icon={msStrikethroughS} title={t("strikeout")}
                                            hotkey={RICH_TEXT_EDITOR_KEYS.STRIKEOUT.title}
                                            active={inStrikeout} command={formatStrikeout}/>
                        <FormattingMenuItem icon={msReport} title={t("spoiler")}
                                            active={inSpoiler} command={formatSpoiler}/>
                        {supportsComplexBlocks &&
                            <>
                                <div className="dropdown-divider"/>
                                <FormattingHeadingButton onSelect={formatHeading}/>
                                <div className="dropdown-divider"/>
                                <FormattingMenuItem icon={msFormatListNumbered} title={t("numbered-list")}
                                                    active={inOrderedList} command={() => formatList(true)}/>
                                <FormattingMenuItem icon={msFormatListBulleted} title={t("bulleted-list")}
                                                    active={inUnorderedList} command={() => formatList(false)}/>
                                {inList &&
                                    <>
                                        <FormattingMenuItem icon={msFormatIndentIncrease} title={t("increase-indent")}
                                                            command={() => formatIndent(1)}/>
                                        <FormattingMenuItem icon={msFormatIndentDecrease} title={t("decrease-indent")}
                                                            command={() => formatIndent(-1)}/>
                                    </>
                                }
                                <FormattingMenuItem icon={msFormatQuote} title={t("quote")}
                                                    hotkey={RICH_TEXT_EDITOR_KEYS.BLOCKQUOTE.title}
                                                    command={formatBlockquote}/>
                                {inBlockquote &&
                                    <FormattingMenuItem icon={msFormatQuoteOff} title={t("unquote")}
                                                        hotkey={RICH_TEXT_EDITOR_KEYS.BLOCKUNQUOTE.title}
                                                        command={formatBlockunquote}/>
                                }
                            </>
                        }
                        <div className="dropdown-divider"/>
                        {supportsComplexBlocks &&
                            <FormattingMenuItem icon={msHorizontalRule} title={t("horizontal-line")}
                                                hotkey={RICH_TEXT_EDITOR_KEYS.HORIZONTAL_RULE.title}
                                                command={formatHorizontalRule}/>
                        }
                        <FormattingOtherButton/>
                        <div className="dropdown-divider"/>
                        <FormattingMenuItem icon={msAlternateEmail} title={t("mention")} active={inMention}
                                            command={() => formatMention(false)}/>
                        <FormattingMenuItem icon={msAddLink} title={t("link")} hotkey={RICH_TEXT_EDITOR_KEYS.LINK.title}
                                            active={inLink} command={formatLink}/>
                        {supportsClear &&
                            <>
                                <div className="dropdown-divider"/>
                                <FormattingMenuItem icon={msFormatClear} title={t("clear-formatting")}
                                                    hotkey={RICH_TEXT_EDITOR_KEYS.CLEAR.title} command={formatClear}/>
                            </>
                        }
                    </div>
                </DropdownMenuContext.Provider>,
                document.querySelector("#hovercard-root")!
            )}
        </span>
    );
}
