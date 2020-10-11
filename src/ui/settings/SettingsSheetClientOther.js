import React from 'react';
import { connect } from 'react-redux';

import SettingsSheetAutomatic from "ui/settings/SettingsSheetAutomatic";
import { mapFilter, mapWithoutKeys } from "util/map";
import { PREFIX } from "api/settings";

const EXCLUDE = new Set([
    PREFIX + "comment.reactions.positive.default",
    PREFIX + "comment.reactions.negative.default",
    PREFIX + "comment.submit-key",
    PREFIX + "comment.replied-to.glance.enabled",
    PREFIX + "posting.time.relative",
    PREFIX + "posting.body.font-magnitude",
    PREFIX + "posting.reply.subject-prefix",
    PREFIX + "posting.reply.preamble",
    PREFIX + "posting.reply.quote-all",
    PREFIX + "posting.reactions.positive.default",
    PREFIX + "posting.reactions.negative.default",
    PREFIX + "posting.reactions.visible.default",
    PREFIX + "posting.reactions.totals-visible.default",
    PREFIX + "reactions.positive.available",
    PREFIX + "reactions.negative.available"
]);

const SettingsSheetClientOther = ({clientValues, clientMeta}) => (
    <SettingsSheetAutomatic valuesMap={clientValues} metaMap={clientMeta}/>
);

export default connect(
    state => ({
        clientValues: state.settings.client.values,
        clientMeta: mapWithoutKeys(mapFilter(state.settings.client.meta, v => !v.internal), EXCLUDE)
    })
)(SettingsSheetClientOther);
