import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { format, formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { CommentInfo } from "api/node/api-types";
import { getDateFnsLocale } from "i18n";
import { ClientState } from "state/state";

type Props = {
    comment: CommentInfo;
} & ConnectedProps<typeof connector>;

function CommentUpdated({comment}: Props) {
    const {t} = useTranslation();

    if (comment.totalRevisions <= 1) {
        return null;
    }

    const editedAt = comment.editedAt ?? comment.createdAt;
    const editedImmediately = Math.abs(editedAt - comment.createdAt) < 20 * 60;

    if (editedImmediately) {
        return null;
    }

    const date = fromUnixTime(editedAt);
    return (
        <time className="date" dateTime={formatISO(date)}>{" "}
            ({t("comment-updated-at")}{" "}
            <abbr title={format(date, "dd-MM-yyyy HH:mm")}>
                {formatDistanceToNow(date, {locale: getDateFnsLocale()})}
            </abbr>)
        </time>
    );
}

const connector = connect(
    (state: ClientState) => ({
        pulse: state.pulse.pulse // To force re-rendering only
    })
);

export default connector(CommentUpdated);
