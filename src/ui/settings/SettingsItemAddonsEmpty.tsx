import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Loading } from "ui/control";

type Props = ConnectedProps<typeof connector>;

const SettingsItemAddonsEmpty = ({loading, loaded}: Props) => {
    const {t} = useTranslation();

    if (loaded) {
        return <div className="mb-4">{t("no-addons")}</div>;
    } else {
        return loading ? <Loading/> : null;
    }
}

const connector = connect(
    (state: ClientState) => ({
        loading: state.settings.plugins.loading,
        loaded: state.settings.plugins.loaded
    })
);

export default connector(SettingsItemAddonsEmpty);
