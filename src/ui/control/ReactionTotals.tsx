import React from 'react';

import { NodeName } from "api";
import { ClientReactionInfo, ReactionTotalInfo, ReactionTotalsInfo } from "api";
import Twemoji from "ui/twemoji/Twemoji";
import { notNull } from "util/misc";
import "./ReactionTotals.css";

function sum(reactionTotals: ReactionTotalInfo[]): number {
    return reactionTotals.map(rt => rt.total).filter(notNull).reduce((sum, v) => sum + v, 0);
}

function topEmojis(reactionTotals: ReactionTotalInfo[]) {
    const actual = reactionTotals.filter(rt => rt.total == null || rt.total > 0);
    actual.sort((rt1, rt2) =>
        rt1.total != null && rt2.total != null ? rt2.total - rt1.total : (rt2.share ?? 0) - (rt1.share ?? 0));
    return actual.slice(0, 3).map(rt => Number(rt.emoji).toString(16));
}

interface EmojisProps {
    className?: string;
    emojis: string[];
    total: number;
    onClick: () => void;
}

const Emojis = ({className, emojis, total, onClick}: EmojisProps) => (
    (total !== 0 || emojis.length !== 0 ) ?
        <span className={className} onClick={onClick}>
            <span className="emojis">
                {emojis.map((code, i) => <Twemoji key={i} code={code}/>)}
            </span>
            {total > 0 ? total : null}
        </span>
    :
        null
);

function filterOutSeniorReaction(reactionTotals: ReactionTotalInfo[],
                                 seniorReaction: ClientReactionInfo): ReactionTotalInfo[] {
    return reactionTotals.map(
        rt => rt.emoji !== seniorReaction.emoji || rt.total == null
            ? rt
            : {emoji: rt.emoji, total: rt.total - 1, share: rt.share}
    );
}

interface ReactionTotalsProps {
    reactions: ReactionTotalsInfo | null;
    seniorReaction?: ClientReactionInfo | null;
    seniorName?: string;
    seniorFullName?: string;
    onClick: (negative: boolean) => void;
}

export function ReactionTotals({reactions, seniorReaction, seniorName, seniorFullName, onClick}: ReactionTotalsProps) {
    let positive = reactions?.positive ?? [];
    let negative = reactions?.negative ?? [];
    if (seniorReaction != null && seniorName != null) {
        if (!seniorReaction.negative) {
            positive = filterOutSeniorReaction(positive, seniorReaction);
        } else {
            negative = filterOutSeniorReaction(negative, seniorReaction);
        }
    }
    const positiveTotal = sum(positive);
    const negativeTotal = sum(negative);
    const positiveTopEmojis = topEmojis(positive);
    const negativeTopEmojis = topEmojis(negative);
    if (positiveTotal === 0 && negativeTotal === 0
        && positiveTopEmojis.length === 0 && negativeTopEmojis.length === 0 && seniorReaction == null) {

        return <div className="reactions"/>;
    }

    return (
        <div className="reactions">
            {seniorReaction &&
                <span className={!seniorReaction.negative ? "senior-positive" : "senior-negative"}
                      title={`Post author (${seniorFullName || NodeName.shorten(seniorName ?? null)})`}
                      onClick={() => onClick(seniorReaction?.negative ?? false)}>
                    <Twemoji code={seniorReaction.emoji}/>
                </span>
            }
            <Emojis className="positive" emojis={positiveTopEmojis} total={positiveTotal}
                    onClick={() => onClick(false)}/>
            <Emojis className="negative" emojis={negativeTopEmojis} total={negativeTotal}
                    onClick={() => onClick(true)}/>
        </div>
    );
}
