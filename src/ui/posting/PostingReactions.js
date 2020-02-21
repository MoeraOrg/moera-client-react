import React from 'react';
import { connect } from 'react-redux';

import { Twemoji } from "ui/control";
import { openReactionsDialog } from "state/reactionsdialog/actions";
import "./PostingReactions.css";

function sum(reactionTotals) {
    return reactionTotals.map(rt => rt.total).filter(v => v != null).reduce((sum, v) => sum + v, 0);
}

function topEmojis(reactionTotals) {
    let actual = reactionTotals.filter(rt => rt.total == null || rt.total > 0);
    actual.sort((rt1, rt2) => rt1.total != null ? rt2.total - rt1.total : rt2.share - rt1.share);
    return actual.slice(0, 3).map(rt => Number(rt.emoji).toString(16));
}

const Emojis = ({className, emojis, total, onClick}) => (
    (total !== 0 || emojis.length !== 0 ) &&
        <span className={className} onClick={onClick}>
            <span className="emojis">
                {emojis.map((code, i) => <Twemoji key={i} code={code}/>)}
            </span>
            {total > 0 ? total : null}
        </span>
);

const PostingReactions = ({posting, openReactionsDialog}) => {
    const positiveTotal = sum(posting.reactions.positive);
    const negativeTotal = sum(posting.reactions.negative);
    const positiveTopEmojis = topEmojis(posting.reactions.positive);
    const negativeTopEmojis = topEmojis(posting.reactions.negative);
    if (positiveTotal === 0 && negativeTotal === 0
        && positiveTopEmojis.length === 0 && negativeTopEmojis.length === 0) {

        return null;
    }

    return (
        <div className="reactions">
            <Emojis className="positive" emojis={positiveTopEmojis} total={positiveTotal}
                    onClick={() => openReactionsDialog(posting.id, false)}/>
            <Emojis className="negative" emojis={negativeTopEmojis} total={negativeTotal}
                    onClick={() => openReactionsDialog(posting.id, true)}/>
        </div>
    );
};

export default connect(
    null,
    { openReactionsDialog }
)(PostingReactions);
