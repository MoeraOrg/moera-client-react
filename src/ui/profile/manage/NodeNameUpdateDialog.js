import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';

import { Button, ModalDialog } from "ui/control";
import { InputField, NumberField } from "ui/control/field";
import { nodeNameUpdate, nodeNameUpdateDialogCancel } from "state/nodename/actions";
import * as Rules from "api/naming/rules";
import { NodeName, RegisteredName } from "api";
import { range } from "util/misc";
import "./NodeNameUpdateDialog.css";

const Column = ({start, end, autoFocus = false}) => (
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

class NodeNameUpdateDialog extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
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
                                <div className="col-sm-4">
                                    <InputField name="name" title="Name" autoFocus/>
                                </div>
                                <div className="col-sm-2">
                                    <NumberField name="generation" title="Generation" min={0}/>
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

    mapPropsToValues(props) {
        const registeredName = NodeName.parse(props.name);
        return {
            name: registeredName.name ?? "",
            generation: registeredName.generation ?? 0,
            mnemonic: Array(24).fill("")
        }
    },

    validationSchema(props) {
        const mnemonic = yup.array().transform((value, originalValue) => (
                Array(24).fill("").map((v, i) => (value[i] ? value[i] : v))
            )).of(yup.string().trim().required("Must not be empty")
                    .matches(/^[A-Za-z]*$/, "Must be a single English word"));
        return props.showChangeName
            ? yup.object().shape({
                name: yup.string().trim().required("Must not be empty").max(Rules.NAME_MAX_LENGTH)
                    .test("is-allowed", "Name is not allowed", Rules.isNameValid),
                generation: yup.number().min(0, "Must be 0 or greater"),
                mnemonic
            })
            : yup.object().shape({
                mnemonic
            })
    },

    handleSubmit(values, formik) {
        formik.props.nodeNameUpdate(
            new RegisteredName(values.name.trim(), values.generation).format(),
            values.mnemonic.map(v => v.trim().toLowerCase()));
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        show: state.nodeName.showingUpdateDialog,
        showChangeName: state.nodeName.showingChangeName,
        updating: state.nodeName.updating,
        name: state.nodeName.name
    }),
    { nodeNameUpdateDialogCancel, nodeNameUpdate }
)(withFormik(nodeNameUpdateDialogLogic)(NodeNameUpdateDialog));
