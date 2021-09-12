import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';

import { AvatarInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { Button, ConflictWarning, Loading } from "ui/control";
import { ComboboxField, InputField, RichTextField } from "ui/control/field";
import { profileEditCancel, profileEditConflictClose, profileUpdate } from "state/profile/actions";
import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import AvatarEditor from "ui/profile/edit/AvatarEditor";
import "./ProfileEditor.css";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    fullName: string;
    title: string;
    gender: string;
    email: string;
    bioSrc: string;
    avatar: AvatarInfo | null;
}

type Props = OuterProps & FormikProps<Values>;

class ProfileEditor extends React.PureComponent<Props> {

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.props.loaded && !prevProps.loaded) {
            this.props.resetForm({
                values: profileEditorLogic.mapPropsToValues(this.props),
            });
        }
    }

    render() {
        const {loading, updating, conflict, profileEditCancel, profileEditConflictClose} = this.props;

        return (
            <>
                <PageHeader>
                    <h2>Edit Profile <Loading active={loading} /></h2>
                </PageHeader>
                <Page>
                    <div className="profile-editor">
                        <Form>
                            <ConflictWarning text="Profile was edited by somebody." show={conflict}
                                             onClose={profileEditConflictClose}/>
                            <AvatarEditor name="avatar"/>
                            <InputField title="Full name" name="fullName" maxLength={96} anyValue autoFocus/>
                            <InputField title="Title" name="title" maxLength={120}/>
                            <ComboboxField title="Gender" name="gender" data={["Male", "Female"]}
                                           col="col-sm-6 pl-0 pr-0"/>
                            <InputField title="E-Mail" name="email" maxLength={63} col="col-sm-6 pl-0 pr-0"/>
                            <RichTextField title="Bio" name="bioSrc" placeholder="Write anything..." format="markdown"
                                           smileysEnabled={true} anyValue/>
                            <div className="profile-editor-footer">
                                <Button variant="secondary" onClick={profileEditCancel}
                                        disabled={updating}>Cancel</Button>
                                <Button variant="primary" type="submit" loading={updating}>Update</Button>
                            </div>
                        </Form>
                    </div>
                </Page>
            </>
        );
    }

}

const profileEditorLogic = {

    mapPropsToValues(props: OuterProps): Values {
        return {
            fullName: props.profile.fullName || "",
            title: props.profile.title || "",
            gender: props.profile.gender || "",
            email: props.profile.email || "",
            bioSrc: props.profile.bioSrc || "",
            avatar: props.profile.avatar ?? null
        }
    },

    validationSchema: yup.object().shape({
        fullName: yup.string().trim().max(96, "Too long"),
        title: yup.string().trim().max(120, "Too long"),
        gender: yup.string().trim().max(31, "Too long"),
        email: yup.string().trim().max(63, "Too long").email("Must be a valid e-mail"),
        bioSrc: yup.string().trim().max(4096, "Too long")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.profileUpdate({
            fullName: values.fullName.trim(),
            title: values.title.trim(),
            gender: values.gender.trim(),
            email: values.email.trim(),
            bioSrc: values.bioSrc.trim(),
            bioSrcFormat: "markdown",
            avatarId: values.avatar ? values.avatar.id : null
        });
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        loading: state.profile.loading,
        loaded: state.profile.loaded,
        conflict: state.profile.conflict,
        updating: state.profile.updating,
        profile: state.profile.profile
    }),
    {profileEditCancel, profileEditConflictClose, profileUpdate}
);

export default connector(withFormik(profileEditorLogic)(ProfileEditor));
