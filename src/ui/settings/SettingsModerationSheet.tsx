import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { Property } from 'csstype';
import { WithTranslation, withTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { messageBox } from "state/messagebox/actions";
import { settingsUpdate } from "state/settings/actions";
import SettingsButtons from "ui/settings/SettingsButtons";
import { CheckboxField } from "ui/control/field";
import { mapEquals } from "util/map";
import "./SettingsSheet.css";

type OuterProps = {
    valuesMap: Map<string, string | null>;
} & ConnectedProps<typeof connector> & WithTranslation;

interface Values {
    googlePlayAllowed: boolean;
}

type Props = OuterProps & FormikProps<Values>;

interface State {
    sheetMaxHeight: Property.MaxHeight;
}

class SettingsModerationSheet extends React.PureComponent<Props, State> {

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
        if (!mapEquals(this.props.valuesMap, prevProps.valuesMap)) {
            this.props.resetForm({
                values: settingsSheetLogic.mapPropsToValues(this.props),
            });
        }
    }

    render() {
        const {t} = this.props;

        return (
            <Form>
                <div className="settings-sheet" style={{maxHeight: this.state.sheetMaxHeight}}>
                    <CheckboxField name="googlePlayAllowed" title={t("want-allow-android-google-play")} anyValue/>
                </div>
                <SettingsButtons/>
            </Form>
        );
    }

}

const settingsSheetLogic = {

    mapPropsToValues(props: OuterProps): Values {
        const sheriffs = (props.valuesMap.get("sheriffs.timeline") ?? "").split(",").map(name => name.trim());
        return {
            googlePlayAllowed: sheriffs.includes(SHERIFF_GOOGLE_PLAY_TIMELINE)
        };
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const sheriffs = [];
        if (values.googlePlayAllowed) {
            sheriffs.push(SHERIFF_GOOGLE_PLAY_TIMELINE);
        }
        formik.props.settingsUpdate([{name: "sheriffs.timeline", value: sheriffs.join(",")}]);
        formik.setSubmitting(false);
    }

};

const connector = connect(
    null,
    { messageBox, settingsUpdate }
);

export default connector(withTranslation()(withFormik(settingsSheetLogic)(SettingsModerationSheet)));
