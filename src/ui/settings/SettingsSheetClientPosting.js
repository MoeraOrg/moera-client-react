import React from 'react';
import { connect } from 'react-redux';

import SettingsSheetAutomatic from "ui/settings/SettingsSheetAutomatic";
import { mapWithKeysOnly } from "util/map";
import { PREFIX } from "api/settings";

const INCLUDE = new Set([
    PREFIX + "posting.time.relative",
    PREFIX + "posting.body.font-magnitude",
    PREFIX + "posting.reply.subject-prefix",
    PREFIX + "posting.reply.preamble",
    PREFIX + "posting.reply.quote-all",
    PREFIX + "posting.smileys.enabled",
    PREFIX + "posting.reactions.positive.default",
    PREFIX + "posting.reactions.negative.default",
    PREFIX + "posting.reactions.visible.default",
    PREFIX + "posting.reactions.totals-visible.default"
]);

const SettingsSheetClientPosting = ({clientValues, clientMeta}) => (
    <SettingsSheetAutomatic valuesMap={clientValues} metaMap={clientMeta}/>
);

export default connect(
    state => ({
        clientValues: state.settings.client.values,
        clientMeta: mapWithKeysOnly(state.settings.client.meta, INCLUDE)
    })
)(SettingsSheetClientPosting);
