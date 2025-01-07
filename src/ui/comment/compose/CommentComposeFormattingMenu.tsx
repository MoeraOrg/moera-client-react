import React from 'react';
import { useTranslation } from 'react-i18next';

import { useButtonPopper } from "ui/hook";
import { msFormatBold, msFormatItalic, msFormatSize, msReport, msStrikethroughS } from "ui/material-symbols";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { RichTextEditorButton } from "ui/control/richtexteditor/panel/RichTextEditorButton";
import { RICH_TEXT_EDITOR_KEYS } from "ui/control/richtexteditor/rich-text-editor-keys";
import { DropdownMenuContext } from "ui/control/dropdownmenu/dropdown-menu-types";
import { FormattingMenuItem } from "ui/comment/compose/FormattingMenuItem";
import "./CommentComposeFormattingMenu.css";

export default function CommentComposeFormattingMenu() {
    const {
        inBold, inItalic, inStrikeout, inSpoiler, formatBold, formatItalic, formatStrikeout, formatSpoiler
    } = useRichTextEditorCommands();

    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes, zIndex, overlayId
    } = useButtonPopper("top", {closeOnSelect: false});
    const {t} = useTranslation();

    return (
        <>
            <span className="formatting-menu-button">
                <RichTextEditorButton className="selector dropdown-toggle" icon={msFormatSize} iconSize={20}
                                      title={t("text-formatting")} onClick={onToggle} ref={setButtonRef}/>
            </span>
            {visible &&
                <DropdownMenuContext.Provider value={{hide, overlayId}}>
                    <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                         className={"fade dropdown-menu shadow-sm show"}>
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
                    </div>
                </DropdownMenuContext.Provider>
            }
        </>
    );
}
