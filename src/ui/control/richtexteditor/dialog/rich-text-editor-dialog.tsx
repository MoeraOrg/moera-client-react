import React from 'react';
import { Form, FormikBag, FormikValues, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { Button, ModalDialog, useModalDialog } from "ui/control";

export type RichTextEditorDialogSubmit<V> = (ok: boolean | null, values: Partial<V>) => void;

export interface RichTextEditorDialogProps<V> {
    prevValues?: V | null;
    onSubmit: RichTextEditorDialogSubmit<V>;
}

export type RichTextEditorDialogBodyProps<P extends RichTextEditorDialogProps<V>, V extends FormikValues> = P & {
    okButtonRef: React.RefObject<HTMLButtonElement>
};

export function richTextEditorDialog<P extends RichTextEditorDialogProps<V>, V extends FormikValues>(
    title: string,
    mapPropsToValues: (props: P) => V,
    DialogBody: React.ComponentType<RichTextEditorDialogBodyProps<P, V>>
) {
    const logic = {
        mapPropsToValues,
        handleSubmit(values: V, formik: FormikBag<RichTextEditorDialogProps<V>, V>) {
            formik.props.onSubmit(true, values);
        }
    };

    const dialog = function (props: P) {
        const {prevValues, onSubmit} = props;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const okButtonRef = React.useRef<HTMLButtonElement>(null);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const {t} = useTranslation();

        const onCancel = () => onSubmit(prevValues == null ? false : null, {});

        const onClose = () => onSubmit(false, {});

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const {overlayId: parentOverlayId} = useModalDialog();

        return (
            <ModalDialog title={t(title)} parentOverlayId={parentOverlayId} onClose={onClose}>
                <Form>
                    <div className="modal-body">
                        <DialogBody {...props} okButtonRef={okButtonRef}/>
                    </div>
                    <div className="modal-footer">
                        <Button variant={prevValues == null ? "secondary" : "danger me-auto"}
                                onClick={onCancel}>{prevValues == null ? t("cancel") : t("delete")}</Button>
                        <Button variant="primary" type="submit" ref={okButtonRef}>{t("ok")}</Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

    return withFormik(logic)(dialog);
}
