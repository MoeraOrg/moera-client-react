import React from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useCollapse } from 'react-collapsed';

import {
    MaterialSymbol,
    msFormatH1,
    msFormatH2,
    msFormatH3,
    msFormatH4,
    msFormatH5,
    msTitle
} from "ui/material-symbols";
import { useDropdownMenu } from "ui/control";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import FormattingSubmenuButton from "ui/comment/compose/FormattingSubmenuButton";
import { FormattingMenuItem } from "ui/comment/compose/FormattingMenuItem";

interface Props {
    onSelect?: (headingLevel: number) => void;
}

export default function FormattingHeadingButton({onSelect}: Props) {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

    const {enableHeading, headingLevel, focus} = useRichTextEditorCommands();
    const {hide} = useDropdownMenu();
    const {t} = useTranslation();

    const onItemSelect = (e: React.MouseEvent, headingLevel: number) => {
        onSelect && onSelect(headingLevel);
        hide();
        focus();
        e.preventDefault();
    };

    return (
        <>
            <FormattingSubmenuButton icon={headingIcon(headingLevel)} title={headingTitle(headingLevel, t)}
                                     disabled={!enableHeading} expanded={isExpanded}
                                     {...getToggleProps({onClick: focus})}/>
            <div className="formatting-menu-sub" {...getCollapseProps()}>
                {[0, 1, 2, 3, 4, 5].map(level =>
                    <FormattingMenuItem key={level} icon={headingIcon(level)} title={headingTitle(level, t)}
                                        active={headingLevel === level} onClick={e => onItemSelect(e, level)}/>
                )}
            </div>
        </>
    );
}

const headingIcon = (headingLevel: number): MaterialSymbol =>
    headingLevel <= 0 ? msTitle : [msFormatH1, msFormatH2, msFormatH3, msFormatH4, msFormatH5][headingLevel - 1];

const headingTitle = (headingLevel: number, t: TFunction): string =>
    headingLevel <= 0 ? t("normal") : t("heading") + " " + headingLevel;
