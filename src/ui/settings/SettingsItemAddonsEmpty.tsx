import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Loading } from "ui/control";

export default function SettingsItemAddonsEmpty() {
    const loading = useSelector((state: ClientState) => state.settings.plugins.loading);
    const loaded = useSelector((state: ClientState) => state.settings.plugins.loaded);
    const {t} = useTranslation();

    if (loaded) {
        return <div className="mb-4">{t("no-addons")}</div>;
    } else {
        return loading ? <Loading/> : null;
    }
}
