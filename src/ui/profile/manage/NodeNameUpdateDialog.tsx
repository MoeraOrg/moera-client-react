import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';

import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";
import { nodeNameUpdate, nodeNameUpdateDialogCancel } from "state/nodename/actions";
import { ClientState } from "state/state";
import * as Rules from "api/naming/rules";
import { NodeName } from "api";
import { range } from "util/misc";
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
                                autoFocus={index === 0 && autoFocus} autoComplete="secret" noFeedback />
                </li>
            ))}
        </ol>
    </div>
);

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    name: string;
    mnemonic: string[];
}

type Props = OuterProps & FormikProps<Values>;

class NodeNameUpdateDialog extends React.PureComponent<Props> {

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.props.show !== prevProps.show) { // Mnemonic must be cleared immediately after hiding the dialog
            this.props.resetForm({
                values: nodeNameUpdateDialogLogic.mapPropsToValues(this.props),
            });
        }
    }

    render() {
        const {show, showChangeName, updating, nodeNameUpdateDialogCancel} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog title={showChangeName ? "Transfer Name From Another Node" : "Update Node Name"} size="lg"
                         onClose={nodeNameUpdateDialogCancel}>
                <Form>
                    <div className="modal-body">
                        {showChangeName &&
                            <div className="row">
                                <div className="col-sm-6">
                                    <InputField name="name" title="Name" autoFocus/>
                                </div>
                            </div>
                        }
                        <h5 className="mnemonic-title">Secret Words</h5>
                        <div className="row">
                            <Column start={0} end={8} autoFocus={!showChangeName} />
                            <Column start={8} end={16} />
                            <Column start={16} end={24} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={nodeNameUpdateDialogCancel}
                                disabled={updating}>Cancel</Button>
                        <Button variant="primary" type="submit" loading={updating}>
                            {showChangeName ? "Transfer" : "Update"}
                        </Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }

}

const nodeNameUpdateDialogLogic = {

    mapPropsToValues(props: OuterProps): Values {
        return {
            name: NodeName.shorten(props.name) ?? "",
            mnemonic: Array(24).fill("")
        }
    },

    validationSchema(props: OuterProps) {
        const mnemonic = yup.array().transform(value =>
                Array(24).fill("").map((v, i) => value[i] ?? v)
            ).of(yup.string().trim()
                    .required("Must not be empty")
                    .matches(/^[A-Za-z]*$/, "Must be a single English word"));
        return props.showChangeName ?
            yup.object().shape({
                name: yup.string().trim()
                    .required("Must not be empty")
                    .max(Rules.NAME_MAX_LENGTH)
                    .test("is-allowed", "Name is not allowed", Rules.isRegisteredNameValid),
                mnemonic
            })
        :
            yup.object().shape({
                mnemonic
            })
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.nodeNameUpdate(
            NodeName.parse(values.name.trim()).format(),
            values.mnemonic.map(v => v.trim().toLowerCase()));
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.nodeName.showingUpdateDialog,
        showChangeName: state.nodeName.showingChangeName,
        updating: state.nodeName.updating,
        name: state.nodeName.name
    }),
    { nodeNameUpdateDialogCancel, nodeNameUpdate }
);

export default connector(withFormik(nodeNameUpdateDialogLogic)(NodeNameUpdateDialog));
