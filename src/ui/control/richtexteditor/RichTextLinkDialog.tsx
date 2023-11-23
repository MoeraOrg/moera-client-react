import React from 'react';
import { useTranslation } from 'react-i18next';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextLinkValues {
    text?: string;
    href?: string;
}

interface Props extends RichTextEditorDialogProps<RichTextLinkValues> {
    text: string;
}

const mapPropsToValues = (props: Props): RichTextLinkValues => ({
    text: props.text ?? "",
    href: ""
});

function RichTextLinkDialog() {
    const {t} = useTranslation();

    return (
        <>
            <InputField name="text" title={t("text")}/>
            <InputField name="href" title={t("url")} autoFocus/>
        </>
    );
}

export default richTextEditorDialog<Props, RichTextLinkValues>("insert-link", mapPropsToValues, RichTextLinkDialog);
