import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { faBold, faItalic, faStrikethrough } from '@fortawesome/free-solid-svg-icons';
import { Editor } from 'slate';
import { ReactEditor, useSlateSelector, useSlateStatic } from 'slate-react';

import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import { equalScriptureMarks, ScriptureMarks } from "ui/control/richtexteditor/visual/scripture";

interface Props {
    hiding?: boolean;
}

export default function VisualEditorPanel({hiding}: Props) {
    const editor = useSlateStatic() as ReactEditor;
    const marks = useSlateSelector(editor => Editor.marks(editor) as ScriptureMarks, equalScriptureMarks);

    const {t} = useTranslation();

    const onBold = (event: React.MouseEvent) => {
        editor.addMark("bold", !marks?.bold);
        ReactEditor.focus(editor);
        event.preventDefault();
    }

    const onItalic = (event: React.MouseEvent) => {
        editor.addMark("italic", !marks?.italic);
        ReactEditor.focus(editor);
        event.preventDefault();
    }

    const onStrike = (event: React.MouseEvent) => {
        editor.addMark("strikeout", !marks?.strikeout);
        ReactEditor.focus(editor);
        event.preventDefault();
    }

    return (
        <div className={cx("rich-text-editor-panel", {"hiding": hiding})}>
            <div className="group">
                <RichTextEditorButton icon={faBold} title={t("bold")} letter="B" active={!!marks?.bold}
                                      onClick={onBold}/>
                <RichTextEditorButton icon={faItalic} title={t("italic")} letter="I" active={!!marks?.italic}
                                      onClick={onItalic}/>
                <RichTextEditorButton icon={faStrikethrough} title={t("strikeout")} letter="R"
                                      active={!!marks?.strikeout} onClick={onStrike}/>
            </div>
        </div>
    );
}
