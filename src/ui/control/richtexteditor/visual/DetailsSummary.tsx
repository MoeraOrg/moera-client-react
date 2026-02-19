import React from 'react';
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";

interface Props {
    summary: string | null | undefined;
}

export default function DetailsSummary({summary}: Props) {
    const {formatFold} = useRichTextEditorCommands();

    return (
        <div contentEditable={false} onClick={() => formatFold()}>⯆ {summary || "Details"}</div>
    );
}
