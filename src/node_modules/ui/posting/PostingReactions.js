import React from 'react';
import { connect } from 'react-redux';

import { Twemoji } from "ui/control";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import "./PostingReactions.css";

function sum(reactionTotals) {
    return reactionTotals.map(rt => rt.total).reduce((sum, v) => sum + v, 0);
}

function topEmojis(reactionTotals) {
    let actual = reactionTotals.filter(rt => rt.total > 0);
    actual.sort((rt1, rt2) => rt1.total - rt2.total);
    return actual.slice(0, 3).map(rt => Number(rt.emoji).toString(16));
}

const Emojis = ({className, emojis, total, onClick}) => (
    total !== 0 &&
        <span className={className} onClick={onClick}>
            <span className="emojis">
                {emojis.map((code, i) => <Twemoji key={i} code={code}/>)}
            </span>
            {total}
        </span>
);

const PostingReactions = ({posting, openReactionsDialog}) => {
    const positiveTotal = sum(posting.reactions.positive);
    const negativeTotal = sum(posting.reactions.negative);
    if (positiveTotal === 0 && negativeTotal === 0) {
        return null;
    }

    return (
        <div className="reactions">
            <Emojis className="positive" emojis={topEmojis(posting.reactions.positive)} total={positiveTotal}
                    onClick={() => openReactionsDialog(posting.id, false)}/>
            <Emojis className="negative" emojis={topEmojis(posting.reactions.negative)} total={negativeTotal}
                    onClick={() => openReactionsDialog(posting.id, true)}/>
        </div>
    );
};

export default connect(
    null,
    { openReactionsDialog }
)(PostingReactions);
