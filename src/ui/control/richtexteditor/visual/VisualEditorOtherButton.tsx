import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    msCode,
    msCodeBlocks,
    msExpandCircleDown,
    msFunction,
    msMoreHoriz,
    msSubscript,
    msSuperscript
} from "ui/material-symbols";
import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import { VisualEditorButton } from "ui/control/richtexteditor/visual/VisualEditorButton";
import { VISUAL_EDITOR_KEYS } from "ui/control/richtexteditor/visual/visual-editor-keys";
import { useButtonPopper } from "ui/hook";
import "./VisualEditorOtherButton.css";

interface Props {
    onFold?: () => void;
    onCode?: () => void;
    onCodeBlock?: () => void;
    onFormula?: () => void;
    onSubscript?: () => void;
    onSuperscript?: () => void;
}

export default function VisualEditorOtherButton({
    onFold, onCode, onCodeBlock, onFormula, onSubscript, onSuperscript
}: Props) {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles,
        placement, zIndex
    } = useButtonPopper("bottom", {closeOnSelect: false});

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
                        <VisualEditorButton icon={msExpandCircleDown} title={t("fold")} command={onCommand(onFold)}/>
                        <VisualEditorButton icon={msCode} title={t("code")} letter={VISUAL_EDITOR_KEYS.CODE}
                                            command={onCommand(onCode)}/>
                        <VisualEditorButton icon={msCodeBlocks} title={t("code-block")}
                                            command={onCommand(onCodeBlock)}/>
                        <VisualEditorButton icon={msFunction} title={t("formula")} command={onCommand(onFormula)}/>
                        <VisualEditorButton icon={msSubscript} title={t("subscript")} command={onCommand(onSubscript)}/>
                        <VisualEditorButton icon={msSuperscript} title={t("superscript")}
                                            command={onCommand(onSuperscript)}/>
                    </div>
                    <div ref={setArrowRef} style={arrowStyles} className="popover-arrow"/>
                </div>
            }
        </>
    );
}
