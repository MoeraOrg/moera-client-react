import React from 'react';
import { useTranslation } from 'react-i18next';

import { DetailsSummaryStyle } from "ui/control";
import { InputField, SelectField, SelectFieldChoice } from "ui/control/field";
import {
    richTextEditorDialog,
    RichTextEditorDialogProps
} from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";

export interface RichTextFoldValues {
    summary?: string;
    style?: DetailsSummaryStyle;
}

type Props = RichTextEditorDialogProps<RichTextFoldValues>;

const mapPropsToValues = (props: Props): RichTextFoldValues => ({
    summary: props.prevValues?.summary ?? "",
    style: props.prevValues?.style ?? "normal" as const
});

function RichTextFoldDialog() {
    const {t} = useTranslation();

    const STYLES: SelectFieldChoice[] = [
        {title: "normal", value: "normal"},
        {title: "bold", value: "bold"},
        {title: ["heading", {level: 1}], value: "h1"},
        {title: ["heading", {level: 2}], value: "h2"},
        {title: ["heading", {level: 3}], value: "h3"},
        {title: ["heading", {level: 4}], value: "h4"},
        {title: ["heading", {level: 5}], value: "h5"},
    ];

    return (
        <>
            <InputField name="summary" title={t("summary")} placeholder={t("summary")} anyValue autoFocus/>
            <SelectField name="style" title={t("style")} choices={STYLES} anyValue/>
        </>
    );
}

export default richTextEditorDialog<Props, RichTextFoldValues>("fold", mapPropsToValues, RichTextFoldDialog);
