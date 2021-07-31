import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { PREFIX } from "api/settings";
import { ClientState } from "state/state";
import SettingsSheetAutomatic from "ui/settings/SettingsSheetAutomatic";
import { mapFilter, mapWithoutKeys } from "util/map";

const EXCLUDE = new Set([
    PREFIX + "comment.reactions.positive.default",
    PREFIX + "comment.reactions.negative.default",
    PREFIX + "comment.submit-key",
    PREFIX + "comment.replied-to.glance.enabled",
    PREFIX + "comment.smileys.enabled",
    PREFIX + "posting.time.relative",
    PREFIX + "posting.body.font-magnitude",
    PREFIX + "posting.reply.subject-prefix",
    PREFIX + "posting.reply.preamble",
    PREFIX + "posting.reply.quote-all",
    PREFIX + "posting.reactions.positive.default",
    PREFIX + "posting.reactions.negative.default",
    PREFIX + "posting.reactions.visible.default",
    PREFIX + "posting.reactions.totals-visible.default",
    PREFIX + "posting.smileys.enabled",
    PREFIX + "reactions.positive.available",
    PREFIX + "reactions.negative.available",
    PREFIX + "posting.feed.news.enabled",
    PREFIX + "posting.reactions.self.enabled",
    PREFIX + "comment.reactions.self.enabled"
]);

type Props = ConnectedProps<typeof connector>;

const SettingsSheetClientOther = ({clientValues, clientMeta}: Props) => (
    clientMeta != null ? <SettingsSheetAutomatic valuesMap={clientValues} metaMap={clientMeta}/> : null
);

const connector = connect(
    (state: ClientState) => ({
        clientValues: state.settings.client.values,
        clientMeta: mapWithoutKeys(mapFilter(state.settings.client.meta, v => !v.internal), EXCLUDE)
    })
);

export default connector(SettingsSheetClientOther);
