import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { Loading } from "ui/control";

type Props = ConnectedProps<typeof connector>;

const SettingsItemAddonsEmpty = ({loading, loaded}: Props) => (
    loaded ?
        <div className="mb-4">No add-ons loaded.</div>
    :
        <Loading active={loading}/>
);

const connector = connect(
    (state: ClientState) => ({
        loading: state.settings.plugins.loading,
        loaded: state.settings.plugins.loaded
    })
);

export default connector(SettingsItemAddonsEmpty);
