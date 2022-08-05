import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { Property } from 'csstype';

import { SettingTypes } from "api";
import { ClientSettingMetaInfo } from "api/settings";
import { SettingValue } from "api/setting-types";
import { SettingInfo, SettingMetaInfo } from "api/node/api-types";
import { messageBox } from "state/messagebox/actions";
import { Item, option } from "ui/settings/settings-menu";
import { settingsUpdate } from "state/settings/actions";
import { SettingsSheetItems, toFieldName } from "ui/settings/SettingsSheetItems";
import SettingsButtons from "ui/settings/SettingsButtons";
import { mapEquals } from "util/map";
import "./SettingsSheet.css";

type OuterProps = {
    items?: Item[];
    valuesMap: Map<string, string | null>;
    metaMap: Map<string, SettingMetaInfo> | Map<string, ClientSettingMetaInfo>;
} & ConnectedProps<typeof connector>;

type Values = Partial<Record<string, SettingValue>>;

type Props = OuterProps & FormikProps<Values>;

interface State {
    sheetMaxHeight: Property.MaxHeight;
}

class SettingsSheet extends React.PureComponent<Props, State> {

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = { sheetMaxHeight: "none" };
    }

    componentDidMount() {
        window.addEventListener("resize", this.onResize);
        this.setState({ sheetMaxHeight: this._calcListMaxHeight() });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    onResize = () => {
        this.setState({ sheetMaxHeight: this._calcListMaxHeight() });
    };

    _calcListMaxHeight() {
        const sheetElement = document.getElementsByClassName("settings-sheet").item(0);
        if (sheetElement == null) {
            return "none";
        }
        const buttonsElement = document.getElementsByClassName("settings-buttons").item(0);
        if (buttonsElement == null) {
            return "none";
        }
        const topHeight = sheetElement.getBoundingClientRect().top + window.scrollY;
        const bottomHeight = buttonsElement.getBoundingClientRect().height + 40;
        const maxHeight = window.innerHeight - topHeight - bottomHeight;
        return `${maxHeight}px`;
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (!mapEquals(this.props.valuesMap, prevProps.valuesMap)
            || ((this.props.metaMap.size > 0) !== (prevProps.metaMap.size > 0))) {

            this.props.resetForm({
                values: settingsSheetLogic.mapPropsToValues(this.props),
            });
        }
    }

    render() {
        const {valuesMap, metaMap} = this.props;
        const items = this.props.items ?? [...metaMap.keys()].sort().map(name => option(name));

        return (
            <Form>
                <div className="settings-sheet" style={{maxHeight: this.state.sheetMaxHeight}}>
                    <SettingsSheetItems items={items} valuesMap={valuesMap} metaMap={metaMap}/>
                </div>
                <SettingsButtons/>
            </Form>
        );
    }

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
        const {valuesMap, metaMap, messageBox, settingsUpdate} = formik.props;

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
            messageBox("Some settings have incorrect values.");
        } else {
            settingsUpdate(settingsToUpdate);
        }

        formik.setSubmitting(false);
    }

};

const connector = connect(
    null,
    { messageBox, settingsUpdate }
);

export default connector(withFormik(settingsSheetLogic)(SettingsSheet));
