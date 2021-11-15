import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { PREFIX } from "api/settings";
import { ClientState } from "state/state";
import SettingsSheetAutomatic from "ui/settings/SettingsSheetAutomatic";
import { mapWithKeysOnly } from "util/map";

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
    PREFIX + "posting.reactions.totals-visible.default",
    PREFIX + "posting.feed.news.enabled",
    PREFIX + "posting.reactions.self.enabled",
    PREFIX + "posting.media.compress.default"
]);

type Props = ConnectedProps<typeof connector>;

const SettingsSheetClientPosting = ({clientValues, clientMeta}: Props) => (
    clientMeta != null ? <SettingsSheetAutomatic valuesMap={clientValues} metaMap={clientMeta}/> : null
);

const connector = connect(
    (state: ClientState) => ({
        clientValues: state.settings.client.values,
        clientMeta: mapWithKeysOnly(state.settings.client.meta, INCLUDE)
    })
);

export default connector(SettingsSheetClientPosting);
