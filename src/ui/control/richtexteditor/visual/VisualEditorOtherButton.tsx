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
import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import { VisualEditorButton } from "ui/control/richtexteditor/visual/VisualEditorButton";
import { VISUAL_EDITOR_KEYS } from "ui/control/richtexteditor/visual/visual-editor-keys";
import { useButtonPopper } from "ui/hook";
import "./VisualEditorOtherButton.css";

export default function VisualEditorOtherButton() {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles,
        placement, zIndex
    } = useButtonPopper("bottom", {closeOnSelect: false});
    const {
        inFold, inCode, inSubscript, inSuperscript, inCodeBlock, inFormula, inMark, inImageEmbedded,
        formatFold, formatCode, formatSubscript, formatSuperscript, formatCodeBlock, formatFormula, formatMark,
        formatImageEmbedded
    } = useRichTextEditorCommands();
    const {t} = useTranslation();

    const onCommand = (command?: () => void) => () => {
        command && command();
        hide();
    };

    return (
        <>
            <RichTextEditorButton ref={setButtonRef} icon={msMoreHoriz} title={t("more")} onClick={onToggle}/>
            {visible &&
                <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                     className={`fade popover bs-popover-${placement} shadow-sm show`}>
                    <div className="other-buttons">
                        <VisualEditorButton icon={msExpandCircleDown} title={t("fold")} active={inFold}
                                            command={onCommand(formatFold)}/>
                        <VisualEditorButton icon={msCode} title={t("code")} hotkey={VISUAL_EDITOR_KEYS.CODE.title}
                                            active={inCode} command={onCommand(formatCode)}/>
                        <VisualEditorButton icon={msCodeBlocks} title={t("code-block")} active={inCodeBlock}
                                            command={onCommand(formatCodeBlock)}/>
                        <VisualEditorButton icon={msFunction} title={t("formula")} active={inFormula}
                                            command={onCommand(formatFormula)}/>
                        <VisualEditorButton icon={msSubscript} title={t("subscript")} active={inSubscript}
                                            command={onCommand(formatSubscript)}/>
                        <VisualEditorButton icon={msSuperscript} title={t("superscript")} active={inSuperscript}
                                            command={onCommand(formatSuperscript)}/>
                        <VisualEditorButton icon={msFormatInkHighlighter} title={t("mark")}
                                            hotkey={VISUAL_EDITOR_KEYS.MARK.title} active={inMark}
                                            command={onCommand(formatMark)}/>
                        <VisualEditorButton icon={msSatellite} title={t("image-internet")} active={inImageEmbedded}
                                            command={onCommand(formatImageEmbedded)}/>
                    </div>
                    <div ref={setArrowRef} style={arrowStyles} className="popover-arrow"/>
                </div>
            }
        </>
    );
}
