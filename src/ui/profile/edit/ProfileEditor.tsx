import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { AvatarInfo, FundraiserInfo, PrincipalValue, ProfileInfo } from "api";
import { ClientState } from "state/state";
import { profileEditCancel, profileEditConflictClose, profileUpdate } from "state/profile/actions";
import { Browser } from "ui/browser";
import { Button, ConflictWarning, Loading, RichTextValue } from "ui/control";
import { ComboboxField, InputField, PrincipalField, RichTextField } from "ui/control/field";
import PageHeader from "ui/page/PageHeader";
import { Page } from "ui/page/Page";
import AvatarEditor from "ui/profile/edit/avatar/AvatarEditor";
import DonateField from "ui/profile/edit/donate/DonateField";
import { longGender } from "util/names";
import { isEmail } from "util/misc";
import store from "state/store";
import "./ProfileEditor.css";

interface OuterProps {
    profile: ProfileInfo;
}

interface Values {
    fullName: string;
    title: string;
    gender: string;
    email: string;
    bioSrc: RichTextValue;
    avatar: AvatarInfo | null;
    fundraisers: FundraiserInfo[];
    viewEmail: PrincipalValue;
}

type Props = OuterProps & FormikProps<Values>;

function ProfileEditorInner(props: Props) {
    const {profile, resetForm} = props;

    const loading = useSelector((state: ClientState) => state.profile.loading);
    const loaded = useSelector((state: ClientState) => state.profile.loaded);
    const conflict = useSelector((state: ClientState) => state.profile.conflict);
    const updating = useSelector((state: ClientState) => state.profile.updating);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect(() => {
        const values = profileEditorLogic.mapPropsToValues(props);
        resetForm({values});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded, profile.bioSrc, resetForm]); // 'props' are missing on purpose

    return (
        <>
            <PageHeader>
                <h2>{t("edit-profile")} {loading && <Loading/>}</h2>
            </PageHeader>
            <Page>
                <div className="profile-editor content-panel">
                    <Form>
                        {conflict &&
                            <ConflictWarning text={t("profile-edited-conflict")}
                                             onClose={() => dispatch(profileEditConflictClose())}/>
                        }
                        <AvatarEditor name="avatar"/>
                        <InputField title={t("full-name")} name="fullName" maxLength={96} anyValue autoFocus/>
                        <InputField title={t("title")} name="title" maxLength={120}/>
                        <ComboboxField title={t("gender")} name="gender" col="col-sm-6" data={["Male", "Female"]}
                                       textField={g => longGender(g, t)}/>
                        <div className="row">
                            <InputField title={t("e-mail")} name="email" maxLength={63}
                                        groupClassName="col-sm-6 col-10 pe-0"/>
                            <PrincipalField name="viewEmail"
                                            values={["public", "signed", "subscribed", "friends", "admin"]}
                                            long={!Browser.isTinyScreen()}
                                            groupClassName="col-sm-6 col-2 align-self-end pb-1"/>
                        </div>
                        <RichTextField title={t("bio")} name="bioSrc" placeholder={t("write-anything")}
                                       format="markdown" smileysEnabled anyValue noMedia/>
                        <DonateField title={t("donate")} name="fundraisers"/>
                        <div className="profile-editor-footer">
                            <Button variant="secondary" onClick={() => dispatch(profileEditCancel())}
                                    disabled={updating}>{t("cancel")}</Button>
                            <Button variant="primary" type="submit" loading={updating}>{t("update")}</Button>
                        </div>
                    </Form>
                </div>
            </Page>
        </>
    );
}

const profileEditorLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        fullName: props.profile.fullName || "",
        title: props.profile.title || "",
        gender: props.profile.gender || "",
        email: props.profile.email || "",
        bioSrc: new RichTextValue(props.profile.bioSrc || ""),
        avatar: props.profile.avatar ?? null,
        fundraisers: props.profile.fundraisers ?? [],
        viewEmail: props.profile.operations?.viewEmail ?? "admin"
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (values.fullName.length > 96) {
            errors.fullName = "too-long";
        }
        if (values.title.length > 120) {
            errors.title = "too-long";
        }
        if (values.gender.length > 31) {
            errors.gender = "too-long";
        }
        if (values.email.length > 63) {
            errors.email = "too-long";
        } else if (!isEmail(values.email)) {
            errors.email = "not-valid-e-mail";
        }
        if (values.bioSrc.text.length > 4096) {
            errors.bioSrc = {text: "too-long"};
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        store.dispatch(profileUpdate({
            fullName: values.fullName.trim(),
            title: values.title.trim(),
            gender: values.gender.trim(),
            email: values.email.trim(),
            bioSrc: values.bioSrc.text.trim(),
            bioSrcFormat: "markdown",
            avatarId: values.avatar ? values.avatar.id : null,
            fundraisers: values.fundraisers,
            operations: {
                viewEmail: values.viewEmail
            }
        }));
        formik.setSubmitting(false);
    }

};

const ProfileEditorOuter = withFormik(profileEditorLogic)(ProfileEditorInner);

export default function ProfileEditor() {
    const profile = useSelector((state: ClientState) => state.profile.profile);

    return <ProfileEditorOuter profile={profile}/>;
}
