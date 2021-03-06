import React from 'react';
import { connect } from 'react-redux';

import SettingsSheetAutomatic from "ui/settings/SettingsSheetAutomatic";
import { mapWithKeysOnly } from "util/map";

const INCLUDE = new Set([
    "posting.subject.present",
    "posting.time.relative"
]);

const SettingsSheetNodePosting = ({nodeValues, nodeMeta}) => (
    <SettingsSheetAutomatic valuesMap={nodeValues} metaMap={nodeMeta}/>
);

export default connect(
    state => ({
        nodeValues: state.settings.node.values,
        nodeMeta: mapWithKeysOnly(state.settings.node.meta, INCLUDE)
    })
)(SettingsSheetNodePosting);
