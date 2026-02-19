import React from 'react';

import { DetailsSummaryStyle, detailsSummaryStyleToClassName } from "ui/control";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";

interface Props {
    summary: string | null | undefined;
    style: DetailsSummaryStyle;
}

export default function DetailsSummary({summary, style}: Props) {
    const {formatFold} = useRichTextEditorCommands();

    return (
        <div contentEditable={false} className={detailsSummaryStyleToClassName(style)} onClick={() => formatFold()}>
            ⯆ {summary || "Details"}
        </div>
    );
}
