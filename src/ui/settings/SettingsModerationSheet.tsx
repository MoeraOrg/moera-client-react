import React from 'react';
import { Form, FormikBag, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { settingsUpdate } from "state/settings/actions";
import { CheckboxField } from "ui/control/field";
import { useSettingsSheetResize } from "ui/settings/settings-hooks";
import SettingsButtons from "ui/settings/SettingsButtons";
import { deserializeSheriffs, serializeSheriffs } from "util/sheriff";
import store from "state/store";
import "./SettingsSheet.css";

interface OuterProps {
    valuesMap: Map<string, string | null>;
}

interface Values {
    googlePlayAllowed: boolean;
}

function SettingsModerationSheet() {
    const {t} = useTranslation();

    const sheetMaxHeight = useSettingsSheetResize();

    return (
        <Form>
            <div className="settings-sheet" style={{maxHeight: sheetMaxHeight}}>
                <CheckboxField name="googlePlayAllowed" title={t("want-allow-android-google-play")} anyValue/>
            </div>
            <SettingsButtons/>
        </Form>
    );
}

const settingsSheetLogic = {

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
        store.dispatch(settingsUpdate([{name: "sheriffs.timeline", value: serializeSheriffs(sheriffs)}]));
        formik.setSubmitting(false);
    }

};

export default withFormik(settingsSheetLogic)(SettingsModerationSheet);
