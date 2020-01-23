import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';

import { Button, ConflictWarning, Loading } from "ui/control";
import { ComboboxField, InputField } from "ui/control/field";
import { profileEditCancel, profileEditConflictClose, profileUpdate } from "state/profile/actions";
import "./ProfileEditor.css";

class ProfileEditor extends React.PureComponent {

    static propTypes = {
        loading: PropType.bool,
        loaded: PropType.bool,
        updating: PropType.bool,
        fullName: PropType.string,
        gender: PropType.string,
        email: PropType.string
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.loaded && !prevProps.loaded) {
            this.props.resetForm();
        }
    }

    render() {
        const {loading, updating, conflict, profileEditCancel, profileEditConflictClose} = this.props;

        return (
            <>
                <h2>
                    Edit Profile <Loading active={loading} />
                </h2>
                <div className="profile-editor">
                    <Form>
                        <ConflictWarning text="Profile was edited by somebody." show={conflict}
                                         onClose={profileEditConflictClose}/>
                        <InputField title="Full name" name="fullName" anyValue autoFocus horizontal={true}
                                    labelClassName="col-sm-2" col="col-sm-10" />
                        <ComboboxField title="Gender" name="gender" data={["Male", "Female"]} horizontal={true}
                                       labelClassName="col-sm-2" col="col-sm-10" />
                        <InputField title="E-Mail" name="email" horizontal={true} labelClassName="col-sm-2"
                                    col="col-sm-10" />
                        <div className="profile-editor-footer">
                            <Button variant="secondary" onClick={profileEditCancel} disabled={updating}>Cancel</Button>
                            <Button variant="primary" type="submit" loading={updating}>Update</Button>
                        </div>
                    </Form>
                </div>
            </>
        );
    }

}

const profileEditorLogic = {

    mapPropsToValues(props) {
        return {
            fullName: props.fullName || "",
            gender: props.gender || "",
            email: props.email || ""
        }
    },

    validationSchema: yup.object().shape({
        fullName: yup.string().trim().max(255, "Too long"),
        gender: yup.string().trim().max(31, "Too long"),
        email: yup.string().trim().max(63, "Too long").email("Must be a valid e-mail")
    }),

    handleSubmit(values, formik) {
        formik.props.profileUpdate({
            fullName: values.fullName.trim(),
            gender: values.gender.trim(),
            email: values.email.trim()
        });
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        loading: state.profile.loading,
        loaded: state.profile.loaded,
        conflict: state.profile.conflict,
        updating: state.profile.updating,
        fullName: state.profile.fullName,
        gender: state.profile.gender,
        email: state.profile.email
    }),
    {profileEditCancel, profileEditConflictClose, profileUpdate}
)(withFormik(profileEditorLogic)(ProfileEditor));
