import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { faBold, faItalic, faStrikethrough } from '@fortawesome/free-solid-svg-icons';
import { Editor } from 'slate';
import { useSlateSelector } from 'slate-react';

import { equalScriptureMarks, ScriptureMarks } from "ui/control/richtexteditor/visual/scripture";
import { VisualEditorButton } from "ui/control/richtexteditor/visual/VisualEditorButton";
import { useVisualEditorCommands } from "ui/control/richtexteditor/visual/visual-editor-commands-context";
import { VISUAL_EDITOR_KEYS } from "ui/control/richtexteditor/visual/visual-editor-keys";

interface Props {
    hiding?: boolean;
}

export default function VisualEditorPanel({hiding}: Props) {
    const marks = useSlateSelector(editor => Editor.marks(editor) as ScriptureMarks, equalScriptureMarks);
    const {formatBold, formatItalic, formatStrikeout} = useVisualEditorCommands();

    const {t} = useTranslation();

    return (
        <div className={cx("rich-text-editor-panel", {"hiding": hiding})}>
            <div className="group">
                <VisualEditorButton icon={faBold} title={t("bold")} letter={VISUAL_EDITOR_KEYS.BOLD}
                                    active={!!marks?.bold} command={formatBold}/>
                <VisualEditorButton icon={faItalic} title={t("italic")} letter={VISUAL_EDITOR_KEYS.ITALIC}
                                    active={!!marks?.italic} command={formatItalic}/>
                <VisualEditorButton icon={faStrikethrough} title={t("strikeout")} letter={VISUAL_EDITOR_KEYS.STRIKEOUT}
                                    active={!!marks?.strikeout} command={formatStrikeout}/>
            </div>
        </div>
    );
}
