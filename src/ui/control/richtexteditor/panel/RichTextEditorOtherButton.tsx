import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    msCode,
    msCodeBlocks,
    msExpandCircleDown,
    msFormatInkHighlighter,
    msFunction,
    msMoreHoriz,
    msSatellite,
    msSubscript,
    msSuperscript
} from "ui/material-symbols";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { RICH_TEXT_EDITOR_KEYS } from "ui/control/richtexteditor/rich-text-editor-keys";
import { RichTextEditorButton } from "ui/control/richtexteditor/panel/RichTextEditorButton";
import { useButtonPopper } from "ui/hook";
import "./RichTextEditorOtherButton.css";

export default function RichTextEditorOtherButton() {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles,
        placement, zIndex
    } = useButtonPopper("bottom", {closeOnSelect: false});
    const {
        supportsComplexBlocks, supportsEmbeddedMedia,
        inFold, inCode, inSubscript, inSuperscript, inCodeBlock, inFormula, inMark, inImageEmbedded,
        focus, formatFold, formatCode, formatSubscript, formatSuperscript, formatCodeBlock, formatFormula, formatMark,
        formatImage,
    } = useRichTextEditorCommands();
    const {t} = useTranslation();

    const onClick = (event: React.MouseEvent) => {
        focus();
        onToggle(event);
    }

    const onCommand = (command?: () => void) => () => {
        command && command();
        hide();
    };

    return (
        <>
            <RichTextEditorButton ref={setButtonRef} icon={msMoreHoriz} title={t("more")} onClick={onClick}/>
            {visible &&
                <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                     className={`fade popover bs-popover-${placement} shadow-sm show`}>
                    <div className="other-buttons">
                        {supportsComplexBlocks &&
                            <RichTextEditorButton icon={msExpandCircleDown} title={t("fold")} active={inFold}
                                                  command={onCommand(formatFold)}/>
                        }
                        <RichTextEditorButton icon={msCode} title={t("code")} hotkey={RICH_TEXT_EDITOR_KEYS.CODE.title}
                                              active={inCode} command={onCommand(formatCode)}/>
                        {supportsComplexBlocks &&
                            <>
                                <RichTextEditorButton icon={msCodeBlocks} title={t("code-block")} active={inCodeBlock}
                                                      command={onCommand(formatCodeBlock)}/>
                                <RichTextEditorButton icon={msFunction} title={t("formula")} active={inFormula}
                                                      command={onCommand(formatFormula)}/>
                            </>
                        }
                        <RichTextEditorButton icon={msSubscript} title={t("subscript")} active={inSubscript}
                                              command={onCommand(formatSubscript)}/>
                        <RichTextEditorButton icon={msSuperscript} title={t("superscript")} active={inSuperscript}
                                              command={onCommand(formatSuperscript)}/>
                        <RichTextEditorButton icon={msFormatInkHighlighter} title={t("mark")}
                                              hotkey={RICH_TEXT_EDITOR_KEYS.MARK.title} active={inMark}
                                              command={onCommand(formatMark)}/>
                        {supportsEmbeddedMedia &&
                            <RichTextEditorButton icon={msSatellite} title={t("image-internet")}
                                                  active={inImageEmbedded}
                                                  command={onCommand(() => formatImage(true))}/>
                        }
                    </div>
                    <div ref={setArrowRef} style={arrowStyles} className="popover-arrow"/>
                </div>
            }
        </>
    );
}
