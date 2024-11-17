import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { faBold, faItalic, faStrikethrough } from '@fortawesome/free-solid-svg-icons';

import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";

interface Props {
    hiding?: boolean;
}

export default function VisualEditorPanel({hiding}: Props) {
    const {t} = useTranslation();

    const onBold = (event: React.MouseEvent) => {
        event.preventDefault();
    }

    const onItalic = (event: React.MouseEvent) => {
        event.preventDefault();
    }

    const onStrike = (event: React.MouseEvent) => {
        event.preventDefault();
    }

    return (
        <div className={cx("rich-text-editor-panel", {"hiding": hiding})}>
            <div className="group">
                <RichTextEditorButton icon={faBold} title={t("bold")} letter="B" onClick={onBold}/>
                <RichTextEditorButton icon={faItalic} title={t("italic")} letter="I" onClick={onItalic}/>
                <RichTextEditorButton icon={faStrikethrough} title={t("strikeout")} letter="R"
                                      onClick={onStrike}/>
            </div>
        </div>
    );
}
