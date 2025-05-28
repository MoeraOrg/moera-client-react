import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { dispatch } from "state/store-sagas";
import { searchCloseFilterDialog } from "state/search/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";

interface OuterProps {
    // Define any props required for SearchFilterDialog here, or leave empty for now
}

interface Values {
    isSelected: boolean;
}

type Props = OuterProps & FormikProps<Values>;

function SearchFilterDialogInner({}: Props) {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const onClose = () => dispatch(searchCloseFilterDialog());

    return (
        <ModalDialog title={t("filters")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    <CheckboxField name="isSelected" title={t("select-option")}/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit">{t("ok")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const searchFilterDialogLogic = {

    mapPropsToValues: (): Values => ({
        isSelected: false
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        dispatch(searchCloseFilterDialog());
        formik.setSubmitting(false);
    }

};

const SearchFilterDialogOuter = withFormik(searchFilterDialogLogic)(SearchFilterDialogInner);

export default function SearchFilterDialog() {
    return <SearchFilterDialogOuter/>;
}
