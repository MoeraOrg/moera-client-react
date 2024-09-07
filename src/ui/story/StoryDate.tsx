import React from 'react';
import { useSelector } from 'react-redux';
import { format, formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';
import { getDateFnsLocale } from 'i18n';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import Jump from "ui/navigation/Jump";
import { RelNodeName } from "util/rel-node-name";
import "./StoryDate.css"

interface StoryDateTextProps {
    date: Date;
}

function StoryDateText({date}: StoryDateTextProps) {
    const timeRelative = useSelector((state: ClientState) => getSetting(state, "posting.time.relative") as boolean);
    useSelector((state: ClientState) =>
        getSetting(state, "posting.time.relative") ? state.pulse.pulse : null); // To force re-rendering only

    return (
        <>{
            timeRelative ?
                <time dateTime={formatISO(date)} title={format(date, "dd-MM-yyyy HH:mm")}>
                    {formatDistanceToNow(date, {locale: getDateFnsLocale()})}
                </time>
                :
                <time dateTime={formatISO(date)} title={formatDistanceToNow(date, {locale: getDateFnsLocale()})}>
                    {format(date, "dd-MM-yyyy HH:mm")}
                </time>
        }</>
    );
}

interface Props {
    publishedAt: number;
    nodeName?: RelNodeName | string | null;
    href?: string | null;
}

export default function StoryDate({publishedAt, nodeName, href}: Props) {
    const date = fromUnixTime(publishedAt);

    if (nodeName == null || href == null) {
        return <span className="date"><StoryDateText date={date}/></span>;
    } else {
        return <Jump className="date" nodeName={nodeName} href={href}><StoryDateText date={date}/></Jump>;
    }
}
