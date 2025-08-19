import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { AvatarInfo, FundraiserInfo, PrincipalValue, ProfileInfo, SourceFormat } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { getSetting } from "state/settings/selectors";
import { profileUpdate } from "state/profile/actions";
import { useIsTinyScreen } from "ui/hook/media-query";
import { ComboboxField, InputField, PrincipalField } from "ui/control/field";
import { RichTextField, RichTextValue } from "ui/control/richtexteditor";
import { useSettingsSheetResize } from "ui/settings/settings-hooks";
import SettingsButtons from "ui/settings/SettingsButtons";
import AvatarEditor from "ui/settings/profile/avatar/AvatarEditor";
import DonateField from "ui/settings/profile/donate/DonateField";
import { longGender } from "util/names";
import { isEmail } from "util/misc";

interface OuterProps {
    profile: ProfileInfo;
    srcFormatDefault: SourceFormat;
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

function SettingsProfileSheetInner(props: Props) {
    const {resetForm} = props;

    const loaded = useSelector((state: ClientState) => state.profile.loaded);
    const updating = useSelector((state: ClientState) => state.profile.updating);
    const formId = useSelector((state: ClientState) => state.profile.formId);
    const tinyScreen = useIsTinyScreen();
    const sheetMaxHeight = useSettingsSheetResize();
    const {t} = useTranslation();

    useEffect(() => {
        const values = settingsProfileSheetLogic.mapPropsToValues(props);
        resetForm({values});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded, formId, resetForm]); // 'props' are missing on purpose

    return (
        <Form className="settings-sheet-form">
            <div className="settings-sheet" style={{maxHeight: sheetMaxHeight}}>
                <AvatarEditor name="avatar"/>
                <InputField title={t("full-name")} name="fullName" maxLength={96} anyValue autoFocus/>
                <InputField title={t("title")} name="title" maxLength={120}/>
                <RichTextField
                    title={t("bio")}
                    name="bioSrc"
                    placeholder={t("write-anything")}
                    format={props.srcFormatDefault}
                    anyValue
                    noMedia
                />
                <ComboboxField title={t("gender")} name="gender" col="col-sm-6" data={["Male", "Female"]}
                               textField={g => longGender(g, t)}/>
                <div className="row">
                    <InputField title={t("e-mail")} name="email" maxLength={63}
                                groupClassName="col-sm-6 col-10 pe-0"/>
                    <PrincipalField name="viewEmail"
                                    values={["public", "signed", "subscribed", "friends", "admin"]}
                                    long={!tinyScreen}
                                    groupClassName="col-sm-6 col-2 align-self-end pb-1"/>
                </div>
                <DonateField title={t("donate")} name="fundraisers"/>
            </div>
            <SettingsButtons updating={updating}/>
        </Form>
    );
}

const settingsProfileSheetLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        fullName: props.profile.fullName || "",
        title: props.profile.title || "",
        gender: props.profile.gender || "",
        email: props.profile.email || "",
        bioSrc: new RichTextValue(props.profile.bioSrc || "", props.profile.bioSrcFormat ?? props.srcFormatDefault),
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
        } else if (values.email && !isEmail(values.email)) {
            errors.email = "not-valid-e-mail";
        }
        if (values.bioSrc.text.length > 4096) {
            errors.bioSrc = {text: "too-long"};
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        dispatch(profileUpdate({
            fullName: values.fullName.trim(),
            title: values.title.trim(),
            gender: values.gender.trim(),
            email: values.email.trim(),
            bioSrc: values.bioSrc.toText(true),
            bioSrcFormat: formik.props.srcFormatDefault,
            avatarId: values.avatar ? values.avatar.id : null,
            fundraisers: values.fundraisers,
            operations: {
                viewEmail: values.viewEmail
            }
        }));
        formik.setSubmitting(false);
    }

};

const SettingsProfileSheetOuter = withFormik(settingsProfileSheetLogic)(SettingsProfileSheetInner);

export default function SettingsProfileSheet() {
    const profile = useSelector((state: ClientState) => state.profile.profile);
    const srcFormatDefault = useSelector((state: ClientState) =>
        getSetting(state, "src-format.default") as SourceFormat
    );

    return <SettingsProfileSheetOuter profile={profile} srcFormatDefault={srcFormatDefault}/>;
}
