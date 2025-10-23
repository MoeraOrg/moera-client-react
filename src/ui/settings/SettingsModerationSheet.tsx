import React from 'react';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import i18n from 'i18next';
import { Trans } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { dispatch } from "state/store-sagas";
import { settingsUpdate } from "state/settings/actions";
import { CheckboxField } from "ui/control/field";
import { useSettingsResetForm, useSettingsSheetResize } from "ui/settings/settings-hooks";
import SettingsButtons from "ui/settings/SettingsButtons";
import { deserializeSheriffs, getSheriffPolicyHref, serializeSheriffs } from "util/sheriff";
import "./SettingsSheet.css";

interface OuterProps {
    valuesMap: Map<string, string | null>;
}

interface Values {
    googlePlayAllowed: boolean;
}

type Props = OuterProps & FormikProps<Values>;

function SettingsModerationSheet(props: Props) {
    const sheetMaxHeight = useSettingsSheetResize();
    useSettingsResetForm(settingsModerationSheetLogic, props);

    return (
        <Form className="settings-sheet-form">
            <div className="settings-sheet" style={{maxHeight: sheetMaxHeight}}>
                <CheckboxField
                    title={
                        <Trans i18nKey="agree-to-sheriff-oversight">
                            {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                            <a href={getSheriffPolicyHref(i18n.language)} target="_blank" rel="noreferrer"/>
                        </Trans>
                    }
                    name="googlePlayAllowed"
                    anyValue
                />
            </div>
            <SettingsButtons/>
        </Form>
    );
}

const settingsModerationSheetLogic = {

    mapPropsToValues(props: OuterProps): Values {
        const sheriffs = deserializeSheriffs(props.valuesMap.get("sheriffs.timeline"));
        return {
            googlePlayAllowed: sheriffs.includes(SHERIFF_GOOGLE_PLAY_TIMELINE)
        };
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const sheriffs = [];
        if (values.googlePlayAllowed) {
            sheriffs.push(SHERIFF_GOOGLE_PLAY_TIMELINE);
        }
        dispatch(settingsUpdate([{name: "sheriffs.timeline", value: serializeSheriffs(sheriffs)}]));
        formik.setSubmitting(false);
    }

};

export default withFormik(settingsModerationSheetLogic)(SettingsModerationSheet);
