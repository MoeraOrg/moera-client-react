import React from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { useButtonPopper } from "ui/hook";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";

interface Props {
    onSelect?: (headingLevel: number) => void;
}

export default function RichTextEditorHeadingButton({onSelect}: Props) {
    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes, zIndex
    } = useButtonPopper("bottom", {closeOnSelect: false});
    const {enableHeading, headingLevel, focus} = useRichTextEditorCommands();
    const {t} = useTranslation();

    const onClick = (event: React.MouseEvent) => {
        focus();
        onToggle(event);
    }

    const onItemSelect = (headingLevel: number) => {
        onSelect && onSelect(headingLevel);
        hide();
        focus();
    };

    return (
        <>
            <button className="rich-text-editor-button selector dropdown-toggle ps-3 pe-3" disabled={!enableHeading}
                    onClick={onClick} ref={setButtonRef}>
                <span className="text">{headingTitle(headingLevel, t)}</span>
            </button>
            {visible &&
                <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                     className={"fade dropdown-menu shadow-sm show"}>
                    {[0, 1, 2, 3, 4, 5].map(level =>
                        <div key={level} className={level === 0 ? "dropdown-item" : `dropdown-item fs-${level}`}
                             onClick={() => onItemSelect(level)}>
                            {headingTitle(level, t)}
                        </div>
                    )}
                </div>
            }
        </>
    );
}

const headingTitle = (headingLevel: number, t: TFunction) =>
    headingLevel <= 0 ? t("normal") : t("heading") + " " + headingLevel;
