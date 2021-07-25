import React from 'react';

import { ReactionTotalInfo, ReactionTotalsInfo } from "api/node/api-types";
import Twemoji from "ui/twemoji/Twemoji";
import "./ReactionTotals.css";

function sum(reactionTotals: ReactionTotalInfo[]): number {
    return (reactionTotals.map(rt => rt.total).filter(v => v != null) as number[]).reduce((sum, v) => sum + v, 0);
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

interface ReactionTotalsProps {
    reactions: ReactionTotalsInfo;
    onClick: (negative: boolean) => void;
}

export function ReactionTotals({reactions, onClick}: ReactionTotalsProps) {
    const positiveTotal = sum(reactions.positive);
    const negativeTotal = sum(reactions.negative);
    const positiveTopEmojis = topEmojis(reactions.positive);
    const negativeTopEmojis = topEmojis(reactions.negative);
    if (positiveTotal === 0 && negativeTotal === 0
        && positiveTopEmojis.length === 0 && negativeTopEmojis.length === 0) {

        return <div className="reactions"/>;
    }

    return (
        <div className="reactions">
            <Emojis className="positive" emojis={positiveTopEmojis} total={positiveTotal}
                    onClick={() => onClick(false)}/>
            <Emojis className="negative" emojis={negativeTopEmojis} total={negativeTotal}
                    onClick={() => onClick(true)}/>
        </div>
    );
}
