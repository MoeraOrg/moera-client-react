import React from 'react';
import { useTranslation } from 'react-i18next';

import { msRedo, msUndo } from "ui/material-symbols";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { RichTextEditorButton } from "ui/control/richtexteditor/panel/RichTextEditorButton";
import "./UndoRedoButton.css";

export default function UndoRedoButton() {
    const {supportsUndoRedo, enableUndo, enableRedo, undo, redo} = useRichTextEditorCommands();
    const {t} = useTranslation();

    if (!supportsUndoRedo) {
        return null;
    }

    return (
        <div className="btn-group undo-redo" role="group">
            <RichTextEditorButton className="btn" icon={msUndo} iconSize={20} title={t("undo")} command={undo}
                                  disabled={!enableUndo}/>
            <RichTextEditorButton className="btn" icon={msRedo} iconSize={20} title={t("redo")} command={redo}
                                  disabled={!enableRedo}/>
        </div>
    );
}
