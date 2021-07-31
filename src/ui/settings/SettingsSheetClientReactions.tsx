import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { PREFIX } from "api/settings";
import { ClientState } from "state/state";
import SettingsSheetAutomatic from "ui/settings/SettingsSheetAutomatic";
import { mapWithKeysOnly } from "util/map";

const INCLUDE = new Set([
    PREFIX + "reactions.positive.available",
    PREFIX + "reactions.negative.available"
]);

type Props = ConnectedProps<typeof connector>;

const SettingsSheetClientReactions = ({clientValues, clientMeta}: Props) => (
    clientMeta != null ? <SettingsSheetAutomatic valuesMap={clientValues} metaMap={clientMeta}/> : null
);

const connector = connect(
    (state: ClientState) => ({
        clientValues: state.settings.client.values,
        clientMeta: mapWithKeysOnly(state.settings.client.meta, INCLUDE)
    })
);

export default connector(SettingsSheetClientReactions);
