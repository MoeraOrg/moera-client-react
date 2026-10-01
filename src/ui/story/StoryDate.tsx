import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { differenceInMonths, format, formatISO, fromUnixTime } from 'date-fns';

import { tDistanceToNow } from "i18n/time";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import Jump from "ui/navigation/Jump";
import { RelNodeName } from "util/rel-node-name";
import "./StoryDate.css"

interface StoryDateTextProps {
    date: Date;
    noteOld: boolean;
}

function StoryDateText({date, noteOld}: StoryDateTextProps) {
    const timeRelative = useSelector((state: ClientState) => getSetting(state, "posting.time.relative") as boolean);
    useSelector((state: ClientState) =>
        getSetting(state, "posting.time.relative") ? state.pulse.pulse : null
    ); // To force re-rendering only
    const {t} = useTranslation();

    const months = differenceInMonths(new Date(), date);

    return (
        <>{
            timeRelative ?
                <time dateTime={formatISO(date)} title={format(date, "dd-MM-yyyy HH:mm")}>
                    {tDistanceToNow(date, t)}
                </time>
            :
                <>
                    <time dateTime={formatISO(date)} title={tDistanceToNow(date, t)}>
                        {format(date, "dd-MM-yyyy HH:mm")}
                    </time>
                    {noteOld && <NoteOld months={months}/>}
                </>
        }</>
    );
}

interface NoteOldProps {
    months: number;
}

function NoteOld({months}: NoteOldProps) {
    const {i18n} = useTranslation();

    if (months < 3) {
        return null;
    }

    const relativeFormat = new Intl.RelativeTimeFormat(i18n.language, {
        numeric: "always",
        style: "long",
    });

    return (
        <span className="note-old">
            {months < 12 ?
                relativeFormat.format(-months, "month")
            :
                relativeFormat.format(-Math.floor(months / 12), "year")
            }
        </span>
    );
}

interface Props {
    publishedAt: number;
    nodeName?: RelNodeName | string | null;
    href?: string | null;
    noteOld?: boolean;
}

export default function StoryDate({publishedAt, nodeName, href, noteOld = false}: Props) {
    const date = fromUnixTime(publishedAt);

    if (nodeName == null || href == null) {
        return <span className="date"><StoryDateText date={date} noteOld={noteOld}/></span>;
    } else {
        return (
            <Jump className="date" nodeName={nodeName} href={href}><StoryDateText date={date} noteOld={noteOld}/></Jump>
        );
    }
}
