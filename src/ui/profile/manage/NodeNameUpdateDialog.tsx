import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import * as immutable from 'object-path-immutable';
import { useTranslation } from 'react-i18next';

import { NamingRules, NodeName } from "api";
import { ClientState } from "state/state";
import { nodeNameUpdate, nodeNameUpdateDialogCancel } from "state/nodename/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";
import { range } from "util/misc";
import store from "state/store";
import "./NodeNameUpdateDialog.css";

interface ColumnProps {
    start: number;
    end: number;
    autoFocus?: boolean;
}

const Column = ({start, end, autoFocus = false}: ColumnProps) => (
    <div className="col-sm-4">
        <ol start={start + 1}>
            {range(end - start).map(index => (
                <li key={index}>
                    <InputField name={`mnemonic[${start + index}]`} className="mnemonic-input"
                                autoFocus={index === 0 && autoFocus} autoComplete="secret" noFeedback/>
                </li>
            ))}
        </ol>
    </div>
);

interface OuterProps {
    showChangeName: boolean;
    name: string | null;
}

interface Values {
    name: string;
    mnemonic: string[];
}

type Props = OuterProps & FormikProps<Values>;

function NodeNameUpdateDialogInner({showChangeName}: Props) {
    const updating = useSelector((state: ClientState) => state.nodeName.updating);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(nodeNameUpdateDialogCancel());

    return (
        <ModalDialog title={showChangeName ? t("transfer-node-name") : t("update-node-name")} size="lg"
                     onClose={onClose}>
            <Form>
                <div className="modal-body">
                    {showChangeName &&
                        <div className="row">
                            <div className="col-sm-6">
                                <InputField name="name" title={t("name")} autoFocus/>
                            </div>
                        </div>
                    }
                    <h5 className="mnemonic-title">{t("secret-words")}</h5>
                    <div className="row">
                        <Column start={0} end={8} autoFocus={!showChangeName}/>
                        <Column start={8} end={16}/>
                        <Column start={16} end={24}/>
                    </div>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose} disabled={updating}>
                        {t("cancel")}
                    </Button>
                    <Button variant="primary" type="submit" loading={updating}>
                        {showChangeName ? t("transfer") : t("update-name")}
                    </Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const nodeNameUpdateDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        name: NodeName.shorten(props.name) ?? "",
        mnemonic: Array(24).fill("")
    }),

    validate: (values: Values, props: OuterProps): FormikErrors<Values> => {
        let errors: FormikErrors<Values> = {};

        if (props.showChangeName) {
            const name = values.name.trim();
            if (!name) {
                errors.name = "must-not-empty";
            } else if (name.length > NamingRules.NAME_MAX_LENGTH || !NamingRules.isRegisteredNameValid(name)) {
                errors.name = "name-not-allowed";
            }
        }
        values.mnemonic.forEach((value, i) => {
            const word = value.trim();
            let error: string | null = null;
            if (!word) {
                error = "must-not-empty";
            } else if (!word.match(/^[A-Za-z]*$/)) {
                error = "must-single-english-word";
            }
            if (error != null) {
                errors = immutable.set(errors, ["mnemonic", i], error);
            }
        });

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        store.dispatch(nodeNameUpdate(
            NodeName.parse(values.name.trim()).format(),
            values.mnemonic.map(v => v.trim().toLowerCase())));
        formik.setSubmitting(false);
    }

};

const NodeNameUpdateDialogOuter = withFormik(nodeNameUpdateDialogLogic)(NodeNameUpdateDialogInner);

export default function NodeNameUpdateDialog() {
    const showChangeName = useSelector((state: ClientState) => state.nodeName.showingChangeName);
    const name = useSelector((state: ClientState) => state.nodeName.name);

    return <NodeNameUpdateDialogOuter showChangeName={showChangeName} name={name}/>;
}
