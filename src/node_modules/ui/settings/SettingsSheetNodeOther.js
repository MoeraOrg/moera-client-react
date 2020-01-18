import React from 'react';
import { connect } from 'react-redux';

import SettingsSheetAutomatic from "ui/settings/SettingsSheetAutomatic";
import { mapWithoutKeys } from "util/map";

const EXCLUDE = new Set([
    "posting.subject.present",
    "posting.time.relative"
]);

const SettingsSheetNodeOther = ({nodeValues, nodeMeta}) => (
    <SettingsSheetAutomatic valuesMap={nodeValues} metaMap={nodeMeta}/>
);

export default connect(
    state => ({
        nodeValues: state.settings.node.values,
        nodeMeta: mapWithoutKeys(state.settings.node.meta, EXCLUDE)
    })
)(SettingsSheetNodeOther);
