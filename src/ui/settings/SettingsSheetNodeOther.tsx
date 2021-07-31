import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import SettingsSheetAutomatic from "ui/settings/SettingsSheetAutomatic";
import { mapWithoutKeys } from "util/map";

const EXCLUDE = new Set([
    "posting.subject.present",
    "posting.time.relative"
]);

type Props = ConnectedProps<typeof connector>;

const SettingsSheetNodeOther = ({nodeValues, nodeMeta}: Props) => (
    nodeMeta != null ? <SettingsSheetAutomatic valuesMap={nodeValues} metaMap={nodeMeta}/> : null
);

const connector = connect(
    (state: ClientState) => ({
        nodeValues: state.settings.node.values,
        nodeMeta: mapWithoutKeys(state.settings.node.meta, EXCLUDE)
    })
);

export default connector(SettingsSheetNodeOther);
