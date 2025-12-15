import React from 'react';
import { useTranslation } from 'react-i18next';

import { RecommendedPostingInfo } from "api";
import { AvatarWithPopup } from "ui/control";
import Jump from "ui/navigation/Jump";
import NodeName from "ui/nodename/NodeName";
import "./TrendingPost.css";

interface Props {
    trending: RecommendedPostingInfo;
}

export default function TrendingPost({trending}: Props) {
    return (
        <div className="trending-post">
            <AvatarWithPopup ownerName={trending.ownerName} ownerFullName={trending.ownerFullName}
                             avatar={trending.ownerAvatar} size={24}/>
            <NodeName className="owner" name={trending.ownerName} fullName={trending.ownerFullName}/>
            <Jump nodeName={trending.nodeName} href={`/post/${trending.postingId}`} className="heading">
                {trending.heading}
            </Jump>
            <div className="counters">
                <Counter total={trending.totalPositiveReactions} lastDay={trending.lastDayPositiveReactions}
                         things="count-reactions" newThings="count-new-reactions" newOnThings="count-new-on-reactions"/>
                <Counter total={trending.totalComments} lastDay={trending.lastDayComments}
                         things="count-comments" newThings="count-new-comments" newOnThings="count-new-on-comments"/>
            </div>
        </div>
    );
}

interface CounterProps {
    total: number;
    lastDay: number;
    things: string;
    newThings: string;
    newOnThings: string;
}

function Counter({total, lastDay, things, newThings, newOnThings}: CounterProps) {
    const {t} = useTranslation();

    if (total <= 0) {
        return null;
    }

    if (total === lastDay) {
        return <span>{t(newThings, {count: total})}</span>;
    }

    return (
        <span>
            {t(things, {count: total})}
            {lastDay > 0 && ` (${t(newOnThings, {count: lastDay})})`}
        </span>
    );
}
