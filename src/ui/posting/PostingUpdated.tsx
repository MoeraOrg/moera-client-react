import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { format, formatDistanceToNow, fromUnixTime } from 'date-fns';

import { PostingInfo } from "api/node/api-types";
import { getSetting } from "state/settings/selectors";
import { ClientState } from "state/state";
import { MinimalStoryInfo } from "ui/types";

type Props = {
    posting: PostingInfo;
    story: MinimalStoryInfo | null;
} & ConnectedProps<typeof connector>;

function PostingUpdated({posting, story, timeRelative}: Props) {
    if (posting.totalRevisions <= 1) {
        return null;
    }

    const editedAt = posting.editedAt ?? posting.createdAt;
    const date = fromUnixTime(editedAt);
    const publishedAt = story != null ? story.publishedAt : posting.createdAt;
    const editedSoon = Math.abs(editedAt - publishedAt) < 24 * 60 * 60;
    return (
        <span className="date">
            {" "}(updated {
                timeRelative ?
                    <abbr title={format(date, "dd-MM-yyyy HH:mm")}>{formatDistanceToNow(date)}</abbr>
                :
                    (editedSoon ? format(date, "HH:mm") : format(date, "dd-MM-yyyy HH:mm"))
            })
        </span>
    );
}

const connector = connect(
    (state: ClientState) => ({
        timeRelative: getSetting(state, "posting.time.relative") as boolean,
        pulse: getSetting(state, "posting.time.relative") ? state.pulse.pulse : null // To force re-rendering only
    })
);

export default connector(PostingUpdated);
