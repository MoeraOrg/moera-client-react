import React from 'react';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import i18n from 'i18next';

import { ClientSettingMetaInfo, SettingInfo, SettingMetaInfo, SettingTypes, SettingValue } from "api";
import { dispatch } from "state/store-sagas";
import { messageBox } from "state/messagebox/actions";
import { settingsUpdate } from "state/settings/actions";
import { useSettingsResetForm, useSettingsSheetResize } from "ui/settings/settings-hooks";
import { Item } from "ui/settings/settings-menu";
import { SettingsSheetItems, toFieldName } from "ui/settings/SettingsSheetItems";
import SettingsButtons from "ui/settings/SettingsButtons";
import "./SettingsSheet.css";

interface OuterProps {
    items: Item[];
    valuesMap: Map<string, string | null>;
    metaMap: Map<string, SettingMetaInfo> | Map<string, ClientSettingMetaInfo>;
}

type Values = Partial<Record<string, SettingValue>>;

type Props = OuterProps & FormikProps<Values>;

function SettingsSheet(props: Props) {
    const {valuesMap, metaMap, items} = props;

    const sheetMaxHeight = useSettingsSheetResize();
    useSettingsResetForm(settingsSheetLogic, props);

    return (
        <Form className="settings-sheet-form">
            <div className="settings-sheet" style={{maxHeight: sheetMaxHeight}}>
                <SettingsSheetItems items={items} valuesMap={valuesMap} metaMap={metaMap}/>
            </div>
            <SettingsButtons/>
        </Form>
    );
}

const settingsSheetLogic = {

    mapPropsToValues(props: OuterProps): Values {
        const {valuesMap, metaMap} = props;

        if (metaMap.size === 0) {
            return {};
        }

        let values: Values = {};
        metaMap.forEach((meta, name) => {
            const value = valuesMap.get(name) ?? meta.defaultValue;
            if (value == null) {
                return;
            }
            values[toFieldName(name)] = SettingTypes.toFieldValue(meta.type, value, meta.modifiers);
        });
        return values;
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {valuesMap, metaMap} = formik.props;

        if (metaMap.size === 0) {
            formik.setSubmitting(false);
            return;
        }

        let hasErrors = false;
        let settingsToUpdate: SettingInfo[] = [];
        metaMap.forEach((meta, name) => {
            const fieldName = toFieldName(name);
            let value = values[fieldName];
            if (value == null) {
                return;
            }
            const valid = SettingTypes.validate(value, meta.type, meta.modifiers);
            if (valid !== true) {
                formik.setFieldError(fieldName, valid);
                hasErrors = true;
            } else {
                formik.setFieldError(fieldName, undefined);
                value = SettingTypes.toString(value, meta.type, meta.modifiers);
                if (valuesMap.get(name) !== value) {
                    settingsToUpdate.push({name, value});
                }
            }
        });

        if (hasErrors) {
            dispatch(messageBox(i18n.t("settings-incorrect-values")));
        } else {
            dispatch(settingsUpdate(settingsToUpdate));
        }

        formik.setSubmitting(false);
    }

};

export default withFormik(settingsSheetLogic)(SettingsSheet);
