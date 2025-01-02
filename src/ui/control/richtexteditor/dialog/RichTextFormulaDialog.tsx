import React from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { InputField, TextField } from "ui/control/field";
import { richTextEditorDialog, RichTextEditorDialogProps } from "ui/control/richtexteditor/dialog/rich-text-editor-dialog";
import { Tabs } from "ui/control/Tabs";

export interface RichTextFormulaValues {
    math?: string;
    block: boolean;
}

type Props = RichTextEditorDialogProps<RichTextFormulaValues>;

const mapPropsToValues = (props: Props): RichTextFormulaValues => ({
    math: props.prevValues?.math,
    block: props.prevValues?.block ?? false
});

function RichTextFormulaDialog({prevValues}: Props) {
    const {t} = useTranslation();

    const [, {value: block}, {setValue: setBlock}] = useField<boolean>("block");

    return (
        <>
            <Tabs<boolean> tabs={[
                {
                    title: t("inline-formula"),
                    value: false,
                    visible: prevValues == null || !block
                },
                {
                    title: t("display-formula"),
                    value: true,
                    visible: prevValues == null || block
                }
            ]} className="mb-3" value={block} onChange={setBlock}/>
            {!block ?
                <InputField name="math" anyValue autoFocus/>
            :
                <TextField name="math" placeholder="" maxHeight="10em" rows={6} anyValue autoFocus/>
            }
        </>
    );
}

export default richTextEditorDialog<Props, RichTextFormulaValues>("formula", mapPropsToValues, RichTextFormulaDialog);
