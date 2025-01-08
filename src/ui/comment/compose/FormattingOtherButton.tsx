import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCollapse } from 'react-collapsed';

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
import { FormattingMenuItem } from "ui/comment/compose/FormattingMenuItem";
import FormattingSubmenuButton from "ui/comment/compose/FormattingSubmenuButton";

export default function FormattingOtherButton() {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

    const {
        supportsComplexBlocks, supportsEmbeddedMedia,
        inFold, inCode, inSubscript, inSuperscript, inCodeBlock, inFormula, inMark, inImageEmbedded,
        formatFold, formatCode, formatSubscript, formatSuperscript, formatCodeBlock, formatFormula, formatMark,
        formatImage
    } = useRichTextEditorCommands();
    const {t} = useTranslation();

    return (
        <>
            <FormattingSubmenuButton icon={msMoreHoriz} title={t("more")} expanded={isExpanded} {...getToggleProps()}/>
            <div className="formatting-menu-sub" {...getCollapseProps()}>
                {supportsComplexBlocks &&
                    <FormattingMenuItem icon={msExpandCircleDown} title={t("fold")} active={inFold}
                                        command={formatFold}/>
                }
                <FormattingMenuItem icon={msCode} title={t("code")} hotkey={RICH_TEXT_EDITOR_KEYS.CODE.title}
                                    active={inCode} command={formatCode}/>
                {supportsComplexBlocks &&
                    <>
                        <FormattingMenuItem icon={msCodeBlocks} title={t("code-block")} active={inCodeBlock}
                                            command={formatCodeBlock}/>
                        <FormattingMenuItem icon={msFunction} title={t("formula")} active={inFormula}
                                            command={formatFormula}/>
                    </>
                }
                <FormattingMenuItem icon={msSubscript} title={t("subscript")} active={inSubscript}
                                    command={formatSubscript}/>
                <FormattingMenuItem icon={msSuperscript} title={t("superscript")} active={inSuperscript}
                                    command={formatSuperscript}/>
                <FormattingMenuItem icon={msFormatInkHighlighter} title={t("mark")}
                                    hotkey={RICH_TEXT_EDITOR_KEYS.MARK.title} active={inMark} command={formatMark}/>
                {supportsEmbeddedMedia &&
                    <FormattingMenuItem icon={msSatellite} title={t("image-internet")} active={inImageEmbedded}
                                        command={() => formatImage(true)}/>
                }
            </div>
        </>
    );
}
