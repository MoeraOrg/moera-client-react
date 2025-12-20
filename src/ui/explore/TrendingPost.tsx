import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { RecommendedPostingInfo } from "api";
import { AvatarWithPopup } from "ui/control";
import { Icon, MaterialSymbol, msComment, msThumbUp, msTrendingUp16 } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import NodeName from "ui/nodename/NodeName";
import "./TrendingPost.css";

interface Props {
    trending: RecommendedPostingInfo;
    small?: boolean;
    counters: ("reactions" | "comments" | "reactions-icon" | "comments-icon")[];
}

export default function TrendingPost({trending, small, counters}: Props) {
    return (
        <div className={cx("trending-post", {small})}>
            <AvatarWithPopup ownerName={trending.ownerName} ownerFullName={trending.ownerFullName}
                             avatar={trending.ownerAvatar} size={24}/>
            <NodeName className="owner" name={trending.ownerName} fullName={trending.ownerFullName}/>
            <Jump nodeName={trending.nodeName} href={`/post/${trending.postingId}`} className="heading">
                {trending.heading}
            </Jump>
            <div className="counters">
                {counters.map(counter =>
                    <>
                        {counter === "reactions" &&
                            <Counter
                                total={trending.totalPositiveReactions}
                                lastDay={trending.lastDayPositiveReactions}
                                things="count-reactions"
                                newThings="count-new-reactions"
                                newOnThings="count-new-on-reactions"
                            />
                        }
                        {counter === "reactions-icon" &&
                            <IconCounter
                                total={trending.totalPositiveReactions}
                                lastDay={trending.lastDayPositiveReactions}
                                icon={msThumbUp}
                                iconClassName="mb-1"
                            />
                        }
                        {counter === "comments" &&
                            <Counter
                                total={trending.totalComments}
                                lastDay={trending.lastDayComments}
                                things="count-comments"
                                newThings="count-new-comments"
                                newOnThings="count-new-on-comments"
                            />
                        }
                        {counter === "comments-icon" &&
                            <IconCounter
                                total={trending.totalComments}
                                lastDay={trending.lastDayComments}
                                icon={msComment}
                            />
                        }
                    </>
                )}
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
        return <span><Icon icon={msTrendingUp16} size="1.2em" className="me-1 mb-1"/>{t(newThings, {count: total})}</span>;
    }

    return (
        <span>
            {t(things, {count: total})}
            {lastDay > 0 &&
                <>
                    {" ("}
                    <Icon icon={msTrendingUp16} size="1.2em" className="me-1 mb-1"/>
                    {t(newOnThings, {count: lastDay})}{")"}
                </>
            }
        </span>
    );
}

interface IconCounterProps {
    total: number;
    lastDay: number;
    icon: MaterialSymbol;
    iconClassName?: string;
}

function IconCounter({total, lastDay, icon, iconClassName}: IconCounterProps) {
    if (total <= 0) {
        return null;
    }

    if (total === lastDay) {
        return (
            <span>
                <Icon icon={icon} size="1.2em" className={iconClassName}/>
                <Icon icon={msTrendingUp16} size="1.2em" className="me-1 mb-1"/>{total}
            </span>
        );
    }

    return (
        <span>
            <Icon icon={icon} size="1.2em" className={cx("me-1", iconClassName)}/>{total}
            {lastDay > 0 &&
                <>
                    {" ("}
                    <Icon icon={msTrendingUp16} size="1.2em" className="me-1 mb-1"/>
                    {lastDay})
                </>
            }
        </span>
    );
}
