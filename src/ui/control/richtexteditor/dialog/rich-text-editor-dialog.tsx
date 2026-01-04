import React, { useCallback } from 'react';
import { Form, FormikBag, FormikValues, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { Button, ModalDialog } from "ui/control";
import { useParent } from "ui/hook";

export type RichTextEditorDialogSubmit<V> = (ok: boolean | null, values: Partial<V>) => void;

export interface RichTextEditorDialogProps<V> {
    prevValues?: V | null;
    onSubmit: RichTextEditorDialogSubmit<V>;
}

export type RichTextEditorDialogBodyProps<P> = P & {
    okButtonRef: React.RefObject<HTMLButtonElement>
};

export function richTextEditorDialog<P extends RichTextEditorDialogProps<V>, V extends FormikValues>(
    title: string | ((props: P) => string),
    mapPropsToValues: (props: P) => V,
    DialogBody: React.ComponentType<RichTextEditorDialogBodyProps<P>>
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

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const onCancel = useCallback(() => onSubmit(prevValues == null ? false : null, {}), [prevValues, onSubmit]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const onClose = useCallback(() => onSubmit(false, {}), [onSubmit]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const {overlayId: parentOverlayId} = useParent();

        const titleS = typeof title === "function" ? title(props) : title;

        return (
            <ModalDialog title={t(titleS)} parentOverlayId={parentOverlayId} onClose={onClose}>
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
