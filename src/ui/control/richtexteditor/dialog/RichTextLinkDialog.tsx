import React from 'react';
import { useTranslation } from 'react-i18next';

import { InputField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";

export interface RichTextLinkValues {
    href?: string;
    text?: string;
}

type Props = {
    noText?: boolean;
} & RichTextEditorDialogProps<RichTextLinkValues>;

const mapPropsToValues = (props: Props): RichTextLinkValues => ({
    href: props.prevValues?.href ?? "",
    text: ""
});

function RichTextLinkDialog({noText = false, prevValues}: Props) {
    const {t} = useTranslation();

    return (
        <>
            <InputField type="url" name="href" title={t("link")} autoFocus/>
            {(!noText && prevValues == null) &&
                <InputField name="text" title={t("text-optional")}/>
            }
        </>
    );
}

export default richTextEditorDialog<Props, RichTextLinkValues>("insert-link", mapPropsToValues, RichTextLinkDialog);
