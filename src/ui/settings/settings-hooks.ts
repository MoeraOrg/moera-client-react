import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Property } from 'csstype';
import { FormikProps, FormikValues, WithFormikConfig } from 'formik';

import { ClientSettingMetaInfo, SettingMetaInfo } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";

export function useSettingsSheetResize(): Property.MaxHeight {
    const [sheetMaxHeight, setSheetMaxHeight] = useState<Property.MaxHeight>("none");

    const onResize = useCallback(() => setSheetMaxHeight(calcListMaxHeight()), []);

    useEffect(() => {
        window.addEventListener("resize", onResize);
        setSheetMaxHeight(calcListMaxHeight());

        return () => window.removeEventListener("resize", onResize);
    }, [onResize]);

    return sheetMaxHeight;
}

interface SettingsResetFormProps {
    valuesMap?: Map<string, string | null> | null;
    metaMap?: Map<string, SettingMetaInfo> | Map<string, ClientSettingMetaInfo> | null;
}

export function useSettingsResetForm<Props extends SettingsResetFormProps, Values extends FormikValues>(
    logic: WithFormikConfig<Props, Values>, props: Props & FormikProps<Values>
): void {
    const {resetForm} = props;

    const homeOwnerName = useSelector(getHomeOwnerName);
    const formId = useSelector((state: ClientState) => state.settings.formId);

    useEffect(() => {
        if (logic.mapPropsToValues) {
            const values = logic.mapPropsToValues(props);
            resetForm({values});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [homeOwnerName, resetForm, formId]); // 'props' are missing on purpose
}

function calcListMaxHeight() {
    const sheetElement = document.getElementsByClassName("settings-sheet").item(0);
    if (sheetElement == null) {
        return "none";
    }
    const buttonsElement = document.getElementsByClassName("settings-buttons").item(0);
    if (buttonsElement == null) {
        return "none";
    }
    const topHeight = sheetElement.getBoundingClientRect().top + window.scrollY;
    const bottomHeight = buttonsElement.getBoundingClientRect().height + 50;
    const maxHeight = window.innerHeight - topHeight - bottomHeight;
    return `${maxHeight}px`;
}
