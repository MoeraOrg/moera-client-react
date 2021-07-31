import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import SettingsSheetAutomatic from "ui/settings/SettingsSheetAutomatic";
import { mapWithKeysOnly } from "util/map";

const INCLUDE = new Set([
    "posting.subject.present",
    "posting.time.relative"
]);

type Props = ConnectedProps<typeof connector>;

const SettingsSheetNodePosting = ({nodeValues, nodeMeta}: Props) => (
    nodeMeta != null ? <SettingsSheetAutomatic valuesMap={nodeValues} metaMap={nodeMeta}/> : null
);

const connector = connect(
    (state: ClientState) => ({
        nodeValues: state.settings.node.values,
        nodeMeta: mapWithKeysOnly(state.settings.node.meta, INCLUDE)
    })
);

export default connector(SettingsSheetNodePosting);
