import React from 'react';
import { useTranslation } from 'react-i18next';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/rich-text-editor-dialog";

export interface RichTextLinkValues {
    href?: string;
}

interface Props extends RichTextEditorDialogProps<RichTextLinkValues> {
    href: string;
}

const mapPropsToValues = (props: Props): RichTextLinkValues => ({
    href: props.href
});

function RichTextLinkDialog() {
    const {t} = useTranslation();

    return (
        <>
            <InputField name="href" title={t("url")} autoFocus/>
        </>
    );
}

export default richTextEditorDialog<Props, RichTextLinkValues>("insert-link", mapPropsToValues, RichTextLinkDialog);
